import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/modals/welcome-modal";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Subjects from "@/pages/subjects";
import Resources from "@/pages/resources";
import Timer from "@/pages/timer";
import { initializeDefaultData, userProfileStorage, type UserProfile } from "@/lib/storage";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  ExternalLink, 
  Clock 
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const profile = userProfileStorage.create(name);
    setUserProfile(profile);
    setShowWelcome(false);
    initializeDefaultData();
  };

  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50 font-inter flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-jee-primary to-jee-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <LayoutDashboard className="text-white" size={32} />
              </div>
              <p className="text-jee-muted">Loading your study space...</p>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 font-inter">
          <Header userProfile={userProfile} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <div className="mb-8">
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  <TabsTrigger 
                    value="dashboard" 
                    className="flex items-center space-x-2 rounded-lg transition-all data-[state=active]:bg-jee-primary data-[state=active]:text-white"
                    data-testid="tab-dashboard"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tasks" 
                    className="flex items-center space-x-2 rounded-lg transition-all data-[state=active]:bg-jee-primary data-[state=active]:text-white"
                    data-testid="tab-tasks"
                  >
                    <CheckSquare size={16} />
                    <span className="hidden sm:inline">Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subjects" 
                    className="flex items-center space-x-2 rounded-lg transition-all data-[state=active]:bg-jee-primary data-[state=active]:text-white"
                    data-testid="tab-subjects"
                  >
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">Subjects</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources" 
                    className="flex items-center space-x-2 rounded-lg transition-all data-[state=active]:bg-jee-primary data-[state=active]:text-white"
                    data-testid="tab-resources"
                  >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Resources</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timer" 
                    className="flex items-center space-x-2 rounded-lg transition-all data-[state=active]:bg-jee-primary data-[state=active]:text-white"
                    data-testid="tab-timer"
                  >
                    <Clock size={16} />
                    <span className="hidden sm:inline">Timer</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="dashboard" className="mt-0">
                <Dashboard userProfile={userProfile} />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <Tasks />
              </TabsContent>
              
              <TabsContent value="subjects" className="mt-0">
                <Subjects />
              </TabsContent>
              
              <TabsContent value="resources" className="mt-0">
                <Resources />
              </TabsContent>
              
              <TabsContent value="timer" className="mt-0">
                <Timer userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Welcome Modal */}
        <WelcomeModal 
          open={showWelcome} 
          onComplete={handleWelcomeComplete}
        />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
