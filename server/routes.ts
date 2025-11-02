import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

const activeConnections = new Set<WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    activeConnections.add(ws);
    console.log(`Client connected. Active connections: ${activeConnections.size}`);

    ws.on("close", () => {
      activeConnections.delete(ws);
      console.log(`Client disconnected. Active connections: ${activeConnections.size}`);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      activeConnections.delete(ws);
    });
  });

  app.post("/api/admin/broadcast", (req, res) => {
    const { message, title } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const broadcast = {
      type: "admin_broadcast",
      title: title || "Admin Message",
      message,
      timestamp: new Date().toISOString(),
    };

    let sentCount = 0;
    activeConnections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcast));
        sentCount++;
      }
    });

    res.json({ 
      success: true, 
      sentTo: sentCount,
      totalConnections: activeConnections.size 
    });
  });

  app.get("/api/admin/active-users", (req, res) => {
    res.json({ activeUsers: activeConnections.size });
  });

  return httpServer;
}
