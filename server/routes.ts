import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./controllers/auth";
import { registerModuleRoutes } from "./controllers/modules";
import { registerResourceRoutes } from "./controllers/resources";
import { handleChatRequest } from "./services/openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  registerAuthRoutes(app);
  
  // Module routes
  registerModuleRoutes(app);
  
  // Resource routes
  registerResourceRoutes(app);
  
  // Chat API (OpenAI)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await handleChatRequest(message, language || 'es');
      return res.json({ message: response });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({ message: "Error processing chat request" });
    }
  });

  // Simple resource file serving for PDFs and other documents
  const resourcesDir = path.join(__dirname, "../resources");
  
  // Create resources directory if it doesn't exist
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
    
    // Create placeholder files for resources
    const placeholders = [
      { name: "guide.pdf", content: "Placeholder for Prompt Design Guide" },
      { name: "templates.xlsx", content: "Placeholder for Exercise Templates" },
      { name: "examples.pdf", content: "Placeholder for Prompt Examples" },
      { name: "glossary.pdf", content: "Placeholder for AI Glossary" }
    ];
    
    placeholders.forEach(file => {
      fs.writeFileSync(path.join(resourcesDir, file.name), file.content);
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
