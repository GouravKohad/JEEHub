import { GraduationCap, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/lib/storage';

interface HeaderProps {
  userProfile: UserProfile | null;
}

export function Header({ userProfile }: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-jee-primary to-jee-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">JEE Study Manager</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#dashboard" 
              className="text-jee-primary font-medium hover:text-blue-700 transition-colors"
              data-testid="nav-dashboard"
            >
              Dashboard
            </a>
            <a 
              href="#tasks" 
              className="text-jee-muted hover:text-gray-900 transition-colors"
              data-testid="nav-tasks"
            >
              Tasks
            </a>
            <a 
              href="#subjects" 
              className="text-jee-muted hover:text-gray-900 transition-colors"
              data-testid="nav-subjects"
            >
              Subjects
            </a>
            <a 
              href="#resources" 
              className="text-jee-muted hover:text-gray-900 transition-colors"
              data-testid="nav-resources"
            >
              Resources
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-jee-muted hover:text-gray-900 transition-colors"
              data-testid="button-notifications"
            >
              <Bell size={18} />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center p-0"
              >
                3
              </Badge>
            </Button>
            <div 
              className="w-8 h-8 bg-gradient-to-r from-jee-secondary to-jee-primary rounded-full flex items-center justify-center"
              data-testid="user-avatar"
              title={userProfile?.name || 'User'}
            >
              {userProfile?.name ? (
                <span className="text-white text-sm font-medium">
                  {getInitials(userProfile.name)}
                </span>
              ) : (
                <User className="text-white" size={16} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
