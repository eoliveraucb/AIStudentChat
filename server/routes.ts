import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./controllers/auth";
import { registerModuleRoutes } from "./controllers/modules";
import { registerResourceRoutes } from "./controllers/resources";
import { handleChatRequest } from "./services/openai";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  
  // API key validation endpoint
  app.get("/api/openai/validate", async (req, res) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        return res.json({ 
          valid: false, 
          message: "No API key found in environment variables" 
        });
      }
      
      try {
        // Create OpenAI instance with the API key
        const openai = new OpenAI({ apiKey: apiKey.trim() });
        
        // Make a simple API call to verify the key works
        await openai.models.list();
        
        return res.json({ 
          valid: true, 
          message: "API key is valid" 
        });
      } catch (apiError: any) {
        console.error("OpenAI API validation error:", apiError);
        return res.json({ 
          valid: false, 
          message: `API key validation failed: ${apiError.message || 'Unknown error'}` 
        });
      }
    } catch (error) {
      console.error("API validation error:", error);
      return res.status(500).json({ 
        valid: false, 
        message: "Error validating API key" 
      });
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
