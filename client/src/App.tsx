import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SimpleWelcomeModal } from "@/components/new-modals/simple-welcome-modal";
import { InfoModal } from "@/components/info-modal";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Subjects from "@/pages/subjects";
import Resources from "@/pages/resources";
import Timer from "@/pages/timer";
import Schedule from "@/pages/schedule";
import ForYou from "@/pages/for-you";
import { initializeDefaultData, userProfileStorage, type UserProfile } from "@/lib/storage";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  ExternalLink, 
  Clock,
  Calendar,
  Sparkles
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Initialize app and check for user profile
  useEffect(() => {
    const initializeApp = () => {
      // Check if this is a first-time user
      const isFirstTime = userProfileStorage.isFirstTime();
      const existingProfile = userProfileStorage.get();
      
      if (isFirstTime) {
        setShowWelcome(true);
      } else if (existingProfile) {
        setUserProfile(existingProfile);
        initializeDefaultData();
      }
      
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleWelcomeComplete = (name: string) => {
    console.log('handleWelcomeComplete called with name:', name);
    try {
      console.log('Creating user profile...');
      const profile = userProfileStorage.create(name);
      console.log('Profile created:', profile);
      
      console.log('Setting user profile...');
      setUserProfile(profile);
      
      console.log('Setting showWelcome to false...');
      setShowWelcome(false);
      
      console.log('Initializing default data...');
      initializeDefaultData();
      
      console.log('Opening info modal for first-time user...');
      setShowInfoModal(true);
      
      console.log('Welcome setup complete');
    } catch (error) {
      console.error('Error in handleWelcomeComplete:', error);
    }
  };

  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="jee-ui-theme">
          <TooltipProvider>
            <div className="min-h-screen bg-background font-inter flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-jee-primary to-jee-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <LayoutDashboard className="text-white" size={32} />
                </div>
                <p className="text-muted-foreground">Loading your study space...</p>
              </div>
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="jee-ui-theme">
        <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground font-inter transition-all duration-500">
          <Header userProfile={userProfile} onInfoClick={() => setShowInfoModal(true)} />
          
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8 pb-20 sm:pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <div className="mb-4 sm:mb-6 md:mb-8 animate-fade-in flex justify-center">
                <TabsList className="inline-flex items-center justify-center bg-card border border-border rounded-lg sm:rounded-xl px-2 sm:px-4 py-1 shadow-sm hover:shadow-lg transition-all duration-300 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
                  <TabsTrigger 
                    value="dashboard" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-dashboard"
                  >
                    <LayoutDashboard size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tasks" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-tasks"
                  >
                    <CheckSquare size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subjects" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-subjects"
                  >
                    <BookOpen size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Subjects</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-resources"
                  >
                    <ExternalLink size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Resources</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timer" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-timer"
                  >
                    <Clock size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Timer</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="schedule" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-schedule"
                  >
                    <Calendar size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">Schedule</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="for-you" 
                    className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 rounded-md sm:rounded-lg transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-medium hover:scale-105 px-1.5 sm:px-3 py-1.5 sm:py-2"
                    data-testid="tab-for-you"
                  >
                    <Sparkles size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0" />
                    <span className="hidden sm:inline">For You</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="dashboard" className="mt-0 animate-fade-in">
                <Dashboard userProfile={userProfile} />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0 animate-fade-in">
                <Tasks />
              </TabsContent>
              
              <TabsContent value="subjects" className="mt-0 animate-fade-in">
                <Subjects />
              </TabsContent>
              
              <TabsContent value="resources" className="mt-0 animate-fade-in">
                <Resources />
              </TabsContent>
              
              <TabsContent value="timer" className="mt-0 animate-fade-in">
                <Timer userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="schedule" className="mt-0 animate-fade-in">
                <Schedule />
              </TabsContent>

              <TabsContent value="for-you" className="mt-0 animate-fade-in">
                <ForYou />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Welcome Modal */}
        <SimpleWelcomeModal 
          open={showWelcome} 
          onComplete={handleWelcomeComplete}
        />

        {/* Info Modal */}
        <InfoModal
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
        
        <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
