import { useState, useEffect } from "react";
import { GraduationCap, User, Info } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { InfoModal } from "@/components/info-modal";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/storage";
import { userProfileStorage } from "@/lib/storage";

interface HeaderProps {
  userProfile: UserProfile | null;
  onInfoClick?: () => void;
}

export function Header({ userProfile, onInfoClick }: HeaderProps) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    userProfile,
  );
  const [indiaTime, setIndiaTime] = useState<string>("");

  // Update local profile when prop changes
  useEffect(() => {
    setCurrentProfile(userProfile);
  }, [userProfile]);

  // Update India time every second
  useEffect(() => {
    const updateIndiaTime = () => {
      const now = new Date();
      const indiaTimeString = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setIndiaTime(indiaTimeString);
    };

    updateIndiaTime();
    const interval = setInterval(updateIndiaTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };
  return (
    <header className="bg-card/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50 animate-slide-in-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-jee-primary to-jee-accent rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <GraduationCap
                  className="text-white text-sm transition-transform duration-300"
                  size={16}
                />
              </div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                JEE Study Manager
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                IST:
              </span>
              <span className="text-sm font-mono font-semibold text-blue-900 dark:text-blue-100 tabular-nums">
                {indiaTime}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 animate-slide-in-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={onInfoClick}
              className="w-8 h-8 p-0 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              data-testid="button-info"
              title="How to use & About"
            >
              <Info className="text-blue-600 dark:text-blue-400" size={16} />
            </Button>
            <ThemeToggle />
            <div
              className="w-8 h-8 bg-gradient-to-r from-jee-secondary to-jee-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              data-testid="user-avatar"
              title={currentProfile?.name || "User"}
            >
              {currentProfile?.name ? (
                <span className="text-white text-sm font-medium">
                  {getInitials(currentProfile.name)}
                </span>
              ) : (
                <User
                  className="text-white transition-transform duration-300 hover:rotate-12"
                  size={16}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
