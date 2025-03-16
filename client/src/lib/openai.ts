import { apiRequest } from "./queryClient";

// Function to check if the OpenAI API key is valid
export async function checkOpenAIAPIKey(): Promise<{valid: boolean, message: string}> {
  try {
    const response = await apiRequest('GET', '/api/openai/validate');
    return await response.json();
  } catch (error) {
    console.error('Error checking OpenAI API key:', error);
    return { valid: false, message: 'Error checking API key status' };
  }
}

// Predefined responses for common prompts
const predefinedResponses: Record<string, Record<string, string>> = {
  es: {
    "prompt": "Un buen prompt debe ser específico, claro y proporcionar contexto. Intenta formular preguntas precisas y proporcionar detalles relevantes para obtener mejores respuestas.",
    "ejercicio": "Te sugiero revisar los ejercicios en el Módulo 1.3. Allí encontrarás actividades prácticas para mejorar tu habilidad de diseño de prompts.",
    "practica": "Te sugiero revisar los ejercicios en el Módulo 1.3. Allí encontrarás actividades prácticas para mejorar tu habilidad de diseño de prompts.",
    "hola": "¡Hola! Estoy aquí para ayudarte con el diseño de prompts y el uso de inteligencia artificial. ¿En qué puedo asistirte hoy?",
    "ayuda": "¡Hola! Estoy aquí para ayudarte con el diseño de prompts y el uso de inteligencia artificial. ¿En qué puedo asistirte hoy?",
    "default": "Lo siento, no tengo una respuesta predefinida para esa pregunta. Te recomiendo revisar el material en los módulos de aprendizaje para encontrar información relacionada."
  },
  en: {
    "prompt": "A good prompt should be specific, clear, and provide context. Try to formulate precise questions and provide relevant details to get better answers.",
    "exercise": "I suggest reviewing the exercises in Module 1.3. There you'll find practical activities to improve your prompt design skills.",
    "practice": "I suggest reviewing the exercises in Module 1.3. There you'll find practical activities to improve your prompt design skills.",
    "hello": "Hello! I'm here to help you with prompt design and the use of artificial intelligence. How can I assist you today?",
    "help": "Hello! I'm here to help you with prompt design and the use of artificial intelligence. How can I assist you today?",
    "default": "I'm sorry, I don't have a predefined response for that question. I recommend reviewing the material in the learning modules to find related information."
  }
};

// Function to get predefined responses based on message content
export function getPredefinedResponse(message: string, language: string = 'es'): string {
  const lang = language === 'es' ? 'es' : 'en';
  const messageLC = message.toLowerCase();
  
  // Simple keyword matching
  for (const [keyword, response] of Object.entries(predefinedResponses[lang])) {
    if (messageLC.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no keywords match
  return predefinedResponses[lang].default;
}

// Module content data
export const moduleData = {
  module1: {
    objectives: [
      "Comprender los principios de diseño efectivo de prompts para AI",
      "Aprender a estructurar peticiones para obtener respuestas específicas",
      "Practicar en inglés con ejemplos guiados"
    ],
    lessons: [
      { id: "1.1", title: "1.1 Introducción a los prompts", completed: true },
      { id: "1.2", title: "1.2 Estructura y claridad", completed: false },
      { id: "1.3", title: "1.3 Ejercicios prácticos", completed: false }
    ]
  },
  module2: {
    objectives: [
      "Aplicar técnicas de prompt design en situaciones reales",
      "Adaptar prompts para diferentes casos de uso",
      "Optimizar respuestas para diferentes modelos de AI"
    ],
    lessons: [
      { id: "2.1", title: "2.1 Casos de uso educativo", completed: false },
      { id: "2.2", title: "2.2 Aplicaciones profesionales", completed: false },
      { id: "2.3", title: "2.3 Proyecto final", completed: false }
    ]
  }
};

// Resources data
export const resourcesData = [
  {
    title: "Guía de Prompts Efectivos",
    type: "PDF",
    size: "2.3 MB",
    icon: "fas fa-file-pdf",
    iconBg: "bg-blue-100",
    iconColor: "text-primary",
    downloadUrl: "/api/resources/guide.pdf"
  },
  {
    title: "Plantillas de Ejercicios",
    type: "XLSX",
    size: "1.1 MB",
    icon: "fas fa-table",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    downloadUrl: "/api/resources/templates.xlsx"
  },
  {
    title: "Ejemplos de Prompts",
    type: "PDF",
    size: "1.5 MB",
    icon: "fas fa-file-pdf",
    iconBg: "bg-blue-100",
    iconColor: "text-primary",
    downloadUrl: "/api/resources/examples.pdf"
  },
  {
    title: "Glosario de Términos AI",
    type: "PDF",
    size: "0.8 MB",
    icon: "fas fa-book",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    downloadUrl: "/api/resources/glossary.pdf"
  }
];
