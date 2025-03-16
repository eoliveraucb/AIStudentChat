import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Lesson } from "./LearningModule";

interface ModuleContentProps {
  id: string;
  lessons: Lesson[];
  objectives: string[];
  continueLabel: string;
}

export function ModuleContent({ id, lessons, objectives, continueLabel }: ModuleContentProps) {
  return (
    <div className="p-5 bg-gray-50" id={`module-${id}-content`}>
      <div className="space-y-4">
        {objectives.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Objetivos de aprendizaje:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
              {objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
        
        {lessons.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Lecciones:</h4>
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded border border-gray-200 mb-2 overflow-hidden">
                <div className="flex items-center p-3 cursor-pointer">
                  <i className={`fas fa-${lesson.completed ? 'check-circle text-success' : 'circle text-gray-300'} mr-3`}></i>
                  <span className="font-medium">{lesson.title}</span>
                  <i className="fas fa-chevron-right text-gray-400 ml-auto"></i>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/modules/${id}`}>
              {continueLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
