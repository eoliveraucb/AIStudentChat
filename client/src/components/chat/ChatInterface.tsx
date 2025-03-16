import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { getPredefinedResponse, checkOpenAIAPIKey } from "@/lib/openai";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'system';
  content: string;
}

export function ChatInterface() {
  const { translations, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: translations.chatWelcomeMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [interactionsLeft, setInteractionsLeft] = useLocalStorage('interactions-left', 2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if the OpenAI API key is valid when the component loads
  useEffect(() => {
    async function validateAPIKey() {
      try {
        const result = await checkOpenAIAPIKey();
        setApiKeyValid(result.valid);
        
        // If API key is not valid, show a toast message and disable API usage
        if (!result.valid) {
          setUseApi(false);
          toast({
            title: language === 'es' ? "Modo limitado activado" : "Limited mode activated",
            description: language === 'es' 
              ? "No se pudo validar la clave de API de OpenAI. Usando respuestas predefinidas." 
              : "Could not validate OpenAI API key. Using predefined responses.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error validating API key:', error);
        setApiKeyValid(false);
        setUseApi(false);
      }
    }
    
    validateAPIKey();
  }, [language, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      let botResponse;
      
      if (useApi && interactionsLeft > 0) {
        // Use OpenAI API
        const response = await apiRequest('POST', '/api/chat', {
          message: inputValue,
          language
        });
        
        const data = await response.json();
        botResponse = { role: 'system' as const, content: data.message };
        
        // Decrease interactions left
        setInteractionsLeft(interactionsLeft - 1);
      } else {
        // Use predefined responses
        const predefinedResponse = getPredefinedResponse(inputValue, language);
        botResponse = { role: 'system' as const, content: predefinedResponse };
      }
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'system', 
          content: translations.chatError 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Helper function to render message content with clickable links
  const renderMessageContent = (content: string) => {
    // Regular expression to find URLs in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // If no URLs in the content, just return the content as is
    if (!content.match(urlRegex)) {
      return content;
    }
    
    // Split the content by URLs and create an array of text and link elements
    const parts = content.split(urlRegex);
    const matches = content.match(urlRegex) || [];
    
    return parts.reduce((arr, part, index) => {
      if (part) {
        arr.push(<span key={`text-${index}`}>{part}</span>);
      }
      if (matches[index]) {
        const url = matches[index];
        const isImageUrl = url.match(/\.(jpeg|jpg|gif|png)$/) !== null || url.includes('images.openai.com');
        
        if (isImageUrl) {
          // It's an image URL, render both link and preview
          arr.push(
            <div key={`img-${index}`} className="mt-2 mb-2">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                {url}
              </a>
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-w-full">
                <img src={url} alt="Generated" className="max-w-full h-auto" />
              </div>
            </div>
          );
        } else {
          // Regular URL, just make it clickable
          arr.push(
            <a 
              key={`link-${index}`} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {url}
            </a>
          );
        }
      }
      return arr;
    }, [] as React.ReactNode[]);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-semibold text-lg">{translations.chatPractice}</h3>
        <p className="text-sm text-gray-500">{translations.chatSubtitle}</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <i className="fas fa-exclamation-circle mr-1"></i> {translations.limitedUsage}
          </span>
        </div>
      </div>
      
      {/* Chat Interface */}
      <div className="p-5">
        <div className="bg-gray-50 rounded-lg border border-gray-200 h-64 overflow-y-auto p-4 mb-4" id="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'system' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white">
                  <i className="fas fa-robot text-sm"></i>
                </div>
              )}
              
              <div className={`${message.role === 'system' ? 'ml-3' : 'mr-3'} max-w-[80%] ${
                message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
              } p-3 rounded-lg`}>
                <p className="text-sm whitespace-pre-wrap">
                  {renderMessageContent(message.content)}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                  <i className="fas fa-user text-sm text-gray-600"></i>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <div className="ml-3 max-w-[80%] bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">{translations.thinking}...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder={translations.writeMessage}
            className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="bg-primary text-white p-3 rounded-r-lg hover:bg-blue-600"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        
        {/* API Toggle */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <Switch 
                checked={useApi}
                onCheckedChange={setUseApi}
                disabled={interactionsLeft <= 0 || apiKeyValid === false}
              />
              <span className="ml-2 text-gray-600">{translations.useAI}</span>
            </label>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">
              {translations.remainingInteractions}: <span>{interactionsLeft}</span>
            </span>
            <button 
              onClick={() => setInteractionsLeft(5)} 
              className="text-xs bg-secondary hover:bg-blue-700 text-white py-1 px-2 rounded-md"
              title={translations.resetInteractions}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
