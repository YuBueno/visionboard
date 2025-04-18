import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

// Dreams
export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  nextAction: text("next_action"),
  aiConfidence: integer("ai_confidence"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDreamSchema = createInsertSchema(dreams).omit({
  id: true,
  nextAction: true,
  aiConfidence: true,
  createdAt: true,
  updatedAt: true
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 10 }).notNull().default("To-Do"),
  priority: varchar("priority", { length: 10 }).notNull().default("Medium"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(),
  url: text("url").notNull(),
  isVerified: boolean("is_verified").default(false),
  isFree: boolean("is_free").default(true),
  readTime: integer("read_time"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Vision Gallery Items
export const visionItems = pgTable("vision_items", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  title: text("title"),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull().default("image"),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVisionItemSchema = createInsertSchema(visionItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  dreams: many(dreams)
}));

export const dreamsRelations = relations(dreams, ({ one, many }) => ({
  user: one(users, {
    fields: [dreams.userId],
    references: [users.id]
  }),
  tasks: many(tasks),
  resources: many(resources),
  visionItems: many(visionItems)
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  dream: one(dreams, {
    fields: [tasks.dreamId],
    references: [dreams.id]
  })
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  dream: one(dreams, {
    fields: [resources.dreamId],
    references: [dreams.id]
  })
}));

export const visionItemsRelations = relations(visionItems, ({ one }) => ({
  dream: one(dreams, {
    fields: [visionItems.dreamId],
    references: [dreams.id]
  })
}));

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Dream = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type VisionItem = typeof visionItems.$inferSelect;
export type InsertVisionItem = z.infer<typeof insertVisionItemSchema>;
