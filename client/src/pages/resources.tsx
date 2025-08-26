import { useState, useEffect } from 'react';
import { Plus, Search, ExternalLink, Book, Video, Calculator, FileText, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResourceModal } from '@/components/modals/resource-modal';
import { resourceStorage } from '@/lib/storage';
import type { Resource, Subject } from '@shared/schema';

const categoryIcons = {
  book: Book,
  video: Video,
  tool: Calculator,
  pdf: FileText,
  website: ExternalLink,
};

const categoryColors = {
  book: 'bg-blue-100 text-blue-600 border-blue-200',
  video: 'bg-green-100 text-green-600 border-green-200',
  tool: 'bg-purple-100 text-purple-600 border-purple-200',
  pdf: 'bg-red-100 text-red-600 border-red-200',
  website: 'bg-gray-100 text-gray-600 border-gray-200',
};

const subjectColors = {
  Physics: 'bg-blue-100 text-blue-800 border-blue-200',
  Chemistry: 'bg-green-100 text-green-800 border-green-200',
  Mathematics: 'bg-purple-100 text-purple-800 border-purple-200',
  General: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'General' | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, selectedSubject, selectedCategory]);

  const loadResources = () => {
    const allResources = resourceStorage.getAll();
    setResources(allResources);
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    setFilteredResources(filtered);
  };

  const handleResourceCreated = () => {
    loadResources();
  };

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      resourceStorage.delete(id);
      loadResources();
    }
  };

  const getResourceStats = () => {
    const bySubject = resources.reduce((acc, resource) => {
      acc[resource.subject] = (acc[resource.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = resources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { bySubject, byCategory, total: resources.length };
  };

  const stats = getResourceStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-jee-muted">Organize and access your study materials and helpful links</p>
        </div>
        <Button
          onClick={() => setIsResourceModalOpen(true)}
          className="mt-4 lg:mt-0 bg-jee-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-testid="button-add-resource"
        >
          <Plus className="mr-2" size={18} />
          Add New Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="text-blue-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Videos</p>
                <p className="text-2xl font-bold text-green-600">{stats.byCategory.video || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Video className="text-green-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Books</p>
                <p className="text-2xl font-bold text-purple-600">{stats.byCategory.book || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Book className="text-purple-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Websites</p>
                <p className="text-2xl font-bold text-gray-600">{stats.byCategory.website || 0}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="text-gray-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-resources"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject | 'General' | 'All')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jee-primary"
              data-testid="select-filter-subject"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="General">General</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jee-primary"
              data-testid="select-filter-category"
            >
              <option value="All">All Categories</option>
              <option value="video">Videos</option>
              <option value="book">Books</option>
              <option value="pdf">PDFs</option>
              <option value="website">Websites</option>
              <option value="tool">Tools</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12">
              <div className="text-center">
                <ExternalLink className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-jee-muted mb-4">
                  {resources.length === 0 
                    ? "Add your first resource to build your study library!"
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {resources.length === 0 && (
                  <Button
                    onClick={() => setIsResourceModalOpen(true)}
                    className="bg-jee-primary text-white"
                  >
                    <Plus className="mr-2" size={16} />
                    Add Your First Resource
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const IconComponent = categoryIcons[resource.category];
            const categoryColor = categoryColors[resource.category];
            const subjectColor = subjectColors[resource.subject];
            
            return (
              <Card
                key={resource.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer animate-scale-in"
                data-testid={`resource-card-${resource.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColor}`}>
                      <IconComponent size={20} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResource(resource.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      data-testid={`button-delete-${resource.id}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div
                    onClick={() => handleResourceClick(resource.url)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-jee-primary transition-colors">
                      {resource.title}
                    </h3>
                    
                    {resource.description && (
                      <p className="text-sm text-jee-muted mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={subjectColor}>
                          {resource.subject}
                        </Badge>
                        <Badge className={categoryColor}>
                          {resource.category}
                        </Badge>
                      </div>
                      <ExternalLink 
                        size={16} 
                        className="text-gray-400 group-hover:text-jee-primary transition-colors" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Resource Modal */}
      <ResourceModal
        open={isResourceModalOpen}
        onOpenChange={setIsResourceModalOpen}
        onResourceCreated={handleResourceCreated}
      />
    </div>
  );
}