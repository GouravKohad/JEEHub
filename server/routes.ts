import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertFileSchema, insertStudySessionSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const { subject } = req.query;
      const tasks = subject 
        ? await storage.getTasksBySubject(subject as string)
        : await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Task creation error:", error);
      res.status(400).json({ message: "Invalid task data", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // File routes
  app.get("/api/files", async (req, res) => {
    try {
      const { subject } = req.query;
      const files = subject 
        ? await storage.getFilesBySubject(subject as string)
        : await storage.getFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        name: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        subject: req.body.subject || null,
        path: req.file.path,
      };

      const file = await storage.createFile(fileData);
      res.status(201).json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', file.mimeType);
      res.sendFile(path.resolve(file.path));
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete file from disk
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const deleted = await storage.deleteFile(id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Study session routes
  app.get("/api/study-sessions", async (req, res) => {
    try {
      const { subject } = req.query;
      const sessions = subject 
        ? await storage.getStudySessionsBySubject(subject as string)
        : await storage.getStudySessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.post("/api/study-sessions", async (req, res) => {
    try {
      const validatedData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid study session data" });
    }
  });

  // Performance routes
  app.get("/api/performance", async (req, res) => {
    try {
      const { subject } = req.query;
      const performance = subject 
        ? await storage.getPerformanceBySubject(subject as string)
        : await storage.getPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
