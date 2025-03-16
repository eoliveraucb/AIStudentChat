import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { LearningModule } from "@/components/modules/LearningModule";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { moduleData } from "@/lib/openai";

export default function Home() {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [progress, setProgress] = useState(25);

  const modules = [
    {
      id: "1",
      title: translations.module1Title,
      subtitle: translations.module1Subtitle,
      status: 'in-progress' as const,
      lessons: moduleData.module1.lessons,
      objectives: moduleData.module1.objectives
    },
    {
      id: "2",
      title: translations.module2Title,
      subtitle: translations.module2Subtitle,
      status: 'not-started' as const,
      lessons: moduleData.module2.lessons,
      objectives: moduleData.module2.objectives
    }
  ];

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-2">{translations.welcome}</h1>
        <p className="text-gray-600 mb-4">{translations.welcomeDescription}</p>
        
        {/* Progress Status */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{translations.progress}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {/* Learning Modules */}
      <h2 className="text-xl font-semibold mb-4">{translations.learningModules}</h2>
      
      {modules.map((module) => (
        <LearningModule
          key={module.id}
          id={module.id}
          title={module.title}
          subtitle={module.subtitle}
          status={module.status}
          lessons={module.lessons}
          objectives={module.objectives}
        />
      ))}
      
      {/* AI Chat Practice Section */}
      <ChatInterface />
    </MainLayout>
  );
}
