import { MainLayout } from "@/components/layouts/MainLayout";
import { LearningModule } from "@/components/modules/LearningModule";
import { useLanguage } from "@/context/LanguageContext";
import { moduleData } from "@/lib/openai";

export default function Modules() {
  const { translations } = useLanguage();
  
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{translations.learningModules}</h1>
        <p className="text-gray-600">
          {translations.welcomeDescription}
        </p>
      </div>
      
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
    </MainLayout>
  );
}
