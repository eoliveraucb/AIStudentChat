import { useState } from "react";
import { ModuleContent } from "./ModuleContent";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface ModuleProps {
  id: string;
  title: string;
  subtitle: string;
  status: 'not-started' | 'in-progress' | 'completed';
  lessons?: Lesson[];
  objectives?: string[];
}

export function LearningModule({ id, title, subtitle, status, lessons = [], objectives = [] }: ModuleProps) {
  const [isExpanded, setIsExpanded] = useState(status === 'in-progress');
  const { translations } = useLanguage();

  const toggleModule = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusText = () => {
    switch (status) {
      case 'not-started':
        return translations.notStarted;
      case 'in-progress':
        return translations.inProgress;
      case 'completed':
        return translations.completed;
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-600';
      case 'in-progress':
        return 'bg-blue-100 text-primary';
      case 'completed':
        return 'bg-green-100 text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer"
        onClick={toggleModule}
      >
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center">
          <span className={`text-xs font-medium ${getStatusClass()} rounded-full px-2 py-0.5 mr-2`}>
            {getStatusText()}
          </span>
          <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} text-gray-400`}></i>
        </div>
      </div>
      
      {isExpanded && (
        <ModuleContent 
          id={id}
          lessons={lessons}
          objectives={objectives}
          continueLabel={translations.continueLabel}
        />
      )}
    </div>
  );
}
