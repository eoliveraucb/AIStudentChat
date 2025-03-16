import { Button } from "@/components/ui/button";

export interface ResourceProps {
  title: string;
  type: string;
  size: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  downloadUrl: string;
}

export function ResourceCard({ title, type, size, icon, iconBg, iconColor, downloadUrl }: ResourceProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center hover:bg-gray-50">
      <div className={`w-10 h-10 flex items-center justify-center ${iconBg} ${iconColor} rounded-lg mr-3`}>
        <i className={icon}></i>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{type} • {size}</p>
      </div>
      <a 
        href={downloadUrl} 
        download
        className="text-primary hover:text-blue-700"
      >
        <i className="fas fa-download"></i>
      </a>
    </div>
  );
}
