import { useState } from 'react';
import { GraduationCap, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SettingsModal } from '@/components/new-modals/settings-modal';
import type { UserProfile } from '@/lib/storage';

interface HeaderProps {
  userProfile: UserProfile | null;
}

export function Header({ userProfile }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  return (
    <header className="bg-card/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50 animate-slide-in-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-jee-primary to-jee-accent rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <GraduationCap className="text-white text-sm transition-transform duration-300" size={16} />
              </div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">JEE Study Manager</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 animate-slide-in-right">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
              data-testid="button-settings"
            >
              <Settings size={18} className="transition-transform duration-300 hover:rotate-90" />
            </Button>
            <div 
              className="w-8 h-8 bg-gradient-to-r from-jee-secondary to-jee-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              data-testid="user-avatar"
              title={userProfile?.name || 'User'}
            >
              {userProfile?.name ? (
                <span className="text-white text-sm font-medium">
                  {getInitials(userProfile.name)}
                </span>
              ) : (
                <User className="text-white transition-transform duration-300 hover:rotate-12" size={16} />
              )}
            </div>
          </div>
        </div>
      </div>

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}
