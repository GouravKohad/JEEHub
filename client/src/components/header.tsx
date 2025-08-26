import { useState, useEffect } from 'react';
import { GraduationCap, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import type { UserProfile } from '@/lib/storage';
import { userProfileStorage } from '@/lib/storage';

interface HeaderProps {
  userProfile: UserProfile | null;
}

export function Header({ userProfile }: HeaderProps) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(userProfile);

  // Update local profile when prop changes
  useEffect(() => {
    setCurrentProfile(userProfile);
  }, [userProfile]);
  
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
            <div 
              className="w-8 h-8 bg-gradient-to-r from-jee-secondary to-jee-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              data-testid="user-avatar"
              title={currentProfile?.name || 'User'}
            >
              {currentProfile?.name ? (
                <span className="text-white text-sm font-medium">
                  {getInitials(currentProfile.name)}
                </span>
              ) : (
                <User className="text-white transition-transform duration-300 hover:rotate-12" size={16} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
