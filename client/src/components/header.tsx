import { GraduationCap, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
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
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-jee-primary to-jee-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-bold text-foreground">JEE Study Manager</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
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
