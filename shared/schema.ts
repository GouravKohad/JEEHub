import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 50 }).notNull(), // physics, chemistry, mathematics
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // low, medium, high
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  subject: varchar("subject", { length: 50 }),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().default(sql`now()`),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: varchar("subject", { length: 50 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  date: timestamp("date").notNull().default(sql`now()`),
});

export const performance = pgTable("performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: varchar("subject", { length: 50 }).notNull(),
  totalTasks: integer("total_tasks").notNull().default(0),
  completedTasks: integer("completed_tasks").notNull().default(0),
  totalStudyTime: integer("total_study_time").notNull().default(0), // in minutes
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  uploadedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  date: true,
});

export const insertPerformanceSchema = createInsertSchema(performance).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type Performance = typeof performance.$inferSelect;
