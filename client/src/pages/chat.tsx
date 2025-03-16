import { MainLayout } from "@/components/layouts/MainLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useLanguage } from "@/context/LanguageContext";

export default function Chat() {
  const { translations } = useLanguage();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{translations.chatPractice}</h1>
        <p className="text-gray-600">
          {translations.chatSubtitle}
        </p>
      </div>
      
      <ChatInterface />
    </MainLayout>
  );
}
