import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateTimeline, generateResources, analyzeDreamProgress } from "./openai";
import { insertDreamSchema, insertTaskSchema, insertResourceSchema, insertVisionItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Dreams API
  app.get("/api/dreams", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const dreams = await storage.getDreamsByUserId(req.user.id);
      res.json(dreams);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/dreams", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const validatedData = insertDreamSchema.parse(req.body);
      
      // Create the dream
      const dream = await storage.createDream({
        ...validatedData,
        userId: req.user.id,
      });

      // Generate AI timeline and resources for the dream
      generateTimeline(dream.title, dream.description).then(async (timelineData) => {
        // Update the dream with AI insights
        await storage.updateDream(dream.id, {
          nextAction: timelineData.nextAction,
          aiConfidence: timelineData.aiConfidence
        });

        // Create tasks from the timeline
        for (const task of timelineData.tasks) {
          await storage.createTask({
            dreamId: dream.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined
          });
        }
      }).catch(console.error);

      generateResources(dream.title).then(async (resources) => {
        // Create resources
        for (const resource of resources) {
          await storage.createResource({
            dreamId: dream.id,
            title: resource.title,
            description: resource.description,
            type: resource.type,
            url: resource.url,
            isVerified: resource.isVerified,
            isFree: resource.isFree,
            readTime: resource.readTime,
            duration: resource.duration
          });
        }
      }).catch(console.error);

      res.status(201).json(dream);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/dreams/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to view this dream" });
      }

      res.json(dream);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/dreams/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this dream" });
      }

      const updatedDream = await storage.updateDream(dreamId, req.body);
      res.json(updatedDream);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/dreams/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this dream" });
      }

      await storage.deleteDream(dreamId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Tasks API
  app.get("/api/dreams/:id/tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to view tasks for this dream" });
      }

      const tasks = await storage.getTasksByDreamId(dreamId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/dreams/:id/tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to add tasks to this dream" });
      }

      const validatedData = insertTaskSchema.parse({
        ...req.body,
        dreamId
      });
      
      const task = await storage.createTask(validatedData);
      
      // Update AI insights based on new task
      const tasks = await storage.getTasksByDreamId(dreamId);
      analyzeDreamProgress(dream.title, tasks).then(async (analysis) => {
        await storage.updateDream(dreamId, {
          nextAction: analysis.nextAction,
          aiConfidence: analysis.aiConfidence
        });
      }).catch(console.error);
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.patch("/api/tasks/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const dream = await storage.getDreamById(task.dreamId);
      if (dream?.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this task" });
      }

      // If updating status to Done, set completedAt
      const updates = {...req.body};
      if (updates.status === "Done" && task.status !== "Done") {
        updates.completedAt = new Date();
      }

      const updatedTask = await storage.updateTask(taskId, updates);
      
      // Update AI insights when task status changes
      if (updates.status && updates.status !== task.status) {
        const tasks = await storage.getTasksByDreamId(task.dreamId);
        analyzeDreamProgress(dream.title, tasks).then(async (analysis) => {
          await storage.updateDream(task.dreamId, {
            nextAction: analysis.nextAction,
            aiConfidence: analysis.aiConfidence
          });
        }).catch(console.error);
      }
      
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const dream = await storage.getDreamById(task.dreamId);
      if (dream?.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this task" });
      }

      await storage.deleteTask(taskId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Resources API
  app.get("/api/dreams/:id/resources", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to view resources for this dream" });
      }

      const resources = await storage.getResourcesByDreamId(dreamId);
      res.json(resources);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/dreams/:id/resources", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to add resources to this dream" });
      }

      const validatedData = insertResourceSchema.parse({
        ...req.body,
        dreamId
      });
      
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  // Vision Gallery API
  app.get("/api/dreams/:id/vision-items", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to view vision items for this dream" });
      }

      const visionItems = await storage.getVisionItemsByDreamId(dreamId);
      res.json(visionItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/dreams/:id/vision-items", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const dreamId = parseInt(req.params.id);
      if (isNaN(dreamId)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }

      const dream = await storage.getDreamById(dreamId);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }

      if (dream.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to add vision items to this dream" });
      }

      const validatedData = insertVisionItemSchema.parse({
        ...req.body,
        dreamId
      });
      
      const visionItem = await storage.createVisionItem(validatedData);
      res.status(201).json(visionItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
