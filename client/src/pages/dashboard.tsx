import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/header';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { SubjectProgress } from '@/components/dashboard/subject-progress';
import { StudyTimer } from '@/components/dashboard/study-timer';
import { TodaysSchedule } from '@/components/dashboard/todays-schedule';
import { QuickResources } from '@/components/dashboard/quick-resources';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TaskModal } from '@/components/modals/task-modal';
import { ResourceModal } from '@/components/modals/resource-modal';
import { Button } from '@/components/ui/button';
import { initializeDefaultData } from '@/lib/storage';

export default function Dashboard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize default data on component mount
  useEffect(() => {
    initializeDefaultData();
  }, []);

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleResourceCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardOverview onAddTask={() => setIsTaskModalOpen(true)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <SubjectProgress 
              key={`subject-${refreshKey}`}
              onTaskUpdate={handleTaskUpdate} 
            />
            <RecentActivity key={`activity-${refreshKey}`} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudyTimer />
            <TodaysSchedule key={`schedule-${refreshKey}`} />
            <QuickResources 
              key={`resources-${refreshKey}`}
              onAddResource={() => setIsResourceModalOpen(true)} 
            />
            
            {/* Weekly Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-jee-muted">Physics</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full progress-bar" style={{ width: '85%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-jee-muted">Chemistry</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full progress-bar" style={{ width: '72%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-jee-muted">Mathematics</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full progress-bar" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsTaskModalOpen(true)}
          size="lg"
          className="w-14 h-14 bg-gradient-to-r from-jee-primary to-jee-accent text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-float"
          data-testid="fab-add-task"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modals */}
      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onTaskCreated={handleTaskCreated}
      />
      
      <ResourceModal
        open={isResourceModalOpen}
        onOpenChange={setIsResourceModalOpen}
        onResourceCreated={handleResourceCreated}
      />
    </div>
  );
}
