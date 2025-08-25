import { type User, type InsertUser, type Task, type InsertTask, type File, type InsertFile, type StudySession, type InsertStudySession, type Performance, type InsertPerformance } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksBySubject(subject: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // File methods
  getFiles(): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  getFilesBySubject(subject: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<boolean>;

  // Study session methods
  getStudySessions(): Promise<StudySession[]>;
  getStudySessionsBySubject(subject: string): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;

  // Performance methods
  getPerformance(): Promise<Performance[]>;
  getPerformanceBySubject(subject: string): Promise<Performance | undefined>;
  updatePerformance(subject: string, performance: InsertPerformance): Promise<Performance>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private files: Map<string, File>;
  private studySessions: Map<string, StudySession>;
  private performance: Map<string, Performance>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.files = new Map();
    this.studySessions = new Map();
    this.performance = new Map();
    
    // Initialize default performance for each subject
    const subjects = ['physics', 'chemistry', 'mathematics'];
    subjects.forEach(subject => {
      const perf: Performance = {
        id: randomUUID(),
        subject,
        totalTasks: 0,
        completedTasks: 0,
        totalStudyTime: 0,
        lastUpdated: new Date(),
      };
      this.performance.set(subject, perf);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksBySubject(subject: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.subject === subject)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    
    // Update performance
    await this.updateTaskPerformance(task.subject);
    
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    
    // Update performance if completion status changed
    if (updates.completed !== undefined) {
      await this.updateTaskPerformance(updatedTask.subject);
    }
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) return false;
    
    this.tasks.delete(id);
    await this.updateTaskPerformance(task.subject);
    return true;
  }

  // File methods
  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesBySubject(subject: string): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.subject === subject)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      uploadedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Study session methods
  async getStudySessions(): Promise<StudySession[]> {
    return Array.from(this.studySessions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getStudySessionsBySubject(subject: string): Promise<StudySession[]> {
    return Array.from(this.studySessions.values())
      .filter(session => session.subject === subject)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = randomUUID();
    const session: StudySession = {
      ...insertSession,
      id,
      date: new Date(),
    };
    this.studySessions.set(id, session);
    
    // Update performance
    await this.updateStudyTimePerformance(session.subject, session.duration);
    
    return session;
  }

  // Performance methods
  async getPerformance(): Promise<Performance[]> {
    return Array.from(this.performance.values());
  }

  async getPerformanceBySubject(subject: string): Promise<Performance | undefined> {
    return this.performance.get(subject);
  }

  async updatePerformance(subject: string, updates: InsertPerformance): Promise<Performance> {
    const existing = this.performance.get(subject) || {
      id: randomUUID(),
      subject,
      totalTasks: 0,
      completedTasks: 0,
      totalStudyTime: 0,
      lastUpdated: new Date(),
    };

    const updated: Performance = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    };
    
    this.performance.set(subject, updated);
    return updated;
  }

  private async updateTaskPerformance(subject: string): Promise<void> {
    const subjectTasks = await this.getTasksBySubject(subject);
    const totalTasks = subjectTasks.length;
    const completedTasks = subjectTasks.filter(task => task.completed).length;
    
    await this.updatePerformance(subject, {
      subject,
      totalTasks,
      completedTasks,
      totalStudyTime: this.performance.get(subject)?.totalStudyTime || 0,
    });
  }

  private async updateStudyTimePerformance(subject: string, additionalTime: number): Promise<void> {
    const existing = this.performance.get(subject);
    if (existing) {
      await this.updatePerformance(subject, {
        subject,
        totalTasks: existing.totalTasks,
        completedTasks: existing.completedTasks,
        totalStudyTime: existing.totalStudyTime + additionalTime,
      });
    }
  }
}

export const storage = new MemStorage();
