import { MainLayout } from "@/components/layouts/MainLayout";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { useLanguage } from "@/context/LanguageContext";
import { resourcesData } from "@/lib/openai";

export default function Resources() {
  const { translations } = useLanguage();

  return (
    <MainLayout>
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">{translations.downloadableResources}</h3>
          <p className="text-sm text-gray-500">{translations.resourcesSubtitle}</p>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourcesData.map((resource, index) => (
              <ResourceCard
                key={index}
                title={resource.title}
                type={resource.type}
                size={resource.size}
                icon={resource.icon}
                iconBg={resource.iconBg}
                iconColor={resource.iconColor}
                downloadUrl={resource.downloadUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
