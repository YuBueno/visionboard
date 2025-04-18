import { users, dreams, tasks, resources, visionItems } from "@shared/schema";
import type { User, InsertUser, Dream, InsertDream, Task, InsertTask, Resource, InsertResource, VisionItem, InsertVisionItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dream methods
  getDreamsByUserId(userId: number): Promise<Dream[]>;
  getDreamById(id: number): Promise<Dream | undefined>;
  createDream(dream: InsertDream): Promise<Dream>;
  updateDream(id: number, updates: Partial<Dream>): Promise<Dream>;
  deleteDream(id: number): Promise<void>;
  
  // Task methods
  getTasksByDreamId(dreamId: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  
  // Resource methods
  getResourcesByDreamId(dreamId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Vision Item methods
  getVisionItemsByDreamId(dreamId: number): Promise<VisionItem[]>;
  createVisionItem(visionItem: InsertVisionItem): Promise<VisionItem>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Dream methods
  async getDreamsByUserId(userId: number): Promise<Dream[]> {
    return await db.select().from(dreams).where(eq(dreams.userId, userId));
  }

  async getDreamById(id: number): Promise<Dream | undefined> {
    const result = await db.select().from(dreams).where(eq(dreams.id, id));
    return result[0];
  }

  async createDream(insertDream: InsertDream): Promise<Dream> {
    const dreamValues = {
      ...insertDream,
      nextAction: "",
      aiConfidence: 75
    };
    const result = await db.insert(dreams).values(dreamValues).returning();
    return result[0];
  }

  async updateDream(id: number, updates: Partial<Dream>): Promise<Dream> {
    const result = await db
      .update(dreams)
      .set(updates)
      .where(eq(dreams.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Dream with ID ${id} not found`);
    }
    
    return result[0];
  }

  async deleteDream(id: number): Promise<void> {
    // Delete all related records from vision_items table
    await db.delete(visionItems).where(eq(visionItems.dreamId, id));
    
    // Delete all related records from resources table
    await db.delete(resources).where(eq(resources.dreamId, id));
    
    // Delete all related records from tasks table
    await db.delete(tasks).where(eq(tasks.dreamId, id));
    
    // Finally, delete the dream
    await db.delete(dreams).where(eq(dreams.id, id));
  }

  // Task methods
  async getTasksByDreamId(dreamId: number): Promise<Task[]> {
    // First, get completed tasks at the bottom
    const completedTasks = await db
      .select()
      .from(tasks)
      .where(and(
        eq(tasks.dreamId, dreamId),
        eq(tasks.status, "Done")
      ));
      
    // Then get non-completed tasks sorted by priority and due date
    const pendingTasks = await db
      .select()
      .from(tasks)
      .where(and(
        eq(tasks.dreamId, dreamId),
        sql`${tasks.status} != 'Done'`
      ))
      .orderBy(
        // Then by priority (High to Low)
        asc(sql`CASE
          WHEN ${tasks.priority} = 'High' THEN 0
          WHEN ${tasks.priority} = 'Medium' THEN 1
          ELSE 2
        END`),
        // Then by due date
        asc(tasks.dueDate)
      );
      
    // Combine the sorted results
    return [...pendingTasks, ...completedTasks];
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(insertTask).returning();
    return result[0];
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const result = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    return result[0];
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Resource methods
  async getResourcesByDreamId(dreamId: number): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.dreamId, dreamId));
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const result = await db.insert(resources).values(insertResource).returning();
    return result[0];
  }

  // Vision Item methods
  async getVisionItemsByDreamId(dreamId: number): Promise<VisionItem[]> {
    return await db.select().from(visionItems).where(eq(visionItems.dreamId, dreamId));
  }

  async createVisionItem(insertVisionItem: InsertVisionItem): Promise<VisionItem> {
    const result = await db.insert(visionItems).values(insertVisionItem).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();