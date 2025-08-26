import { useState } from 'react';
import { ExternalLink, Book, Video, Calculator, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resourceStorage } from '@/lib/storage';
import type { Resource } from '@shared/schema';

const categoryIcons = {
  book: Book,
  video: Video,
  tool: Calculator,
  pdf: FileText,
  website: ExternalLink,
};

const categoryColors = {
  book: 'bg-blue-100 text-blue-600',
  video: 'bg-green-100 text-green-600',
  tool: 'bg-purple-100 text-purple-600',
  pdf: 'bg-red-100 text-red-600',
  website: 'bg-gray-100 text-gray-600',
};

interface QuickResourcesProps {
  onAddResource: () => void;
}

export function QuickResources({ onAddResource }: QuickResourcesProps) {
  const [resources] = useState<Resource[]>(resourceStorage.getAll().slice(0, 4));

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-sm border border-gray-100 p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Quick Resources
          </CardTitle>
          <Button
            onClick={onAddResource}
            variant="ghost"
            size="sm"
            className="text-jee-primary hover:text-blue-700 transition-colors"
            data-testid="button-add-resource"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-8 text-jee-muted">
              <ExternalLink className="mx-auto mb-3 opacity-50" size={24} />
              <p className="text-sm">No resources yet</p>
              <p className="text-xs">Add your first resource!</p>
            </div>
          ) : (
            resources.map((resource) => {
              const IconComponent = categoryIcons[resource.category];
              const colorClass = categoryColors[resource.category];
              
              return (
                <button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.url)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                  data-testid={`resource-${resource.id}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-jee-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-jee-muted">
                      {resource.description || resource.subject}
                    </p>
                  </div>
                  <ExternalLink 
                    size={14} 
                    className="text-gray-400 group-hover:text-jee-primary transition-colors" 
                  />
                </button>
              );
            })
          )}
          
          {/* Default resources shown when no resources exist */}
          {resources.length === 0 && (
            <div className="space-y-3 opacity-60">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Book className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">NCERT Physics Solutions</p>
                  <p className="text-xs text-jee-muted">Chapter 1-15</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="text-green-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Chemistry Video Lectures</p>
                  <p className="text-xs text-jee-muted">Organic Chemistry</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calculator className="text-purple-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Math Formula Sheet</p>
                  <p className="text-xs text-jee-muted">Quick Reference</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
