import OpenAI from "openai";
import { getPredefinedResponse } from "../../client/src/lib/openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// OpenAI API integration with fallback to predefined responses
export async function handleChatRequest(message: string, language: string): Promise<string> {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log("No OpenAI API key found. Using predefined response.");
      return getPredefinedResponse(message, language);
    }
    
    // Make sure we have a clean API key (remove any whitespace, URLs, etc.)
    const cleanApiKey = apiKey.trim();
    console.log("Attempting to use OpenAI API with provided key");
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: cleanApiKey
    });
    
    // Create a system prompt that focuses on educational prompt design
    const systemPrompt = language === 'es' 
      ? "Eres un asistente educativo especializado en enseñar diseño de prompts para IA. Proporciona respuestas concisas y educativas sobre cómo crear buenos prompts. Las respuestas deben ser de máximo 150 palabras y apropiadas para estudiantes."
      : "You are an educational assistant specialized in teaching AI prompt design. Provide concise, educational responses about how to create good prompts. Responses should be maximum 150 words and appropriate for students.";
    
    try {
      // Make OpenAI API call
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 250,
        temperature: 0.7,
      });
      
      return response.choices[0].message.content || 
        getPredefinedResponse(message, language); // Fallback if empty response
    } catch (apiError) {
      console.error("OpenAI API call failed:", apiError);
      return getPredefinedResponse(message, language);
    }
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Fallback to predefined responses on error
    return getPredefinedResponse(message, language);
  }
}
