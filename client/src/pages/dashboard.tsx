import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { SubjectProgress } from '@/components/dashboard/subject-progress';
import { StudyTimer } from '@/components/dashboard/study-timer';
import { TodaysSchedule } from '@/components/dashboard/todays-schedule';
import { QuickResources } from '@/components/dashboard/quick-resources';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { SimpleTaskModal } from '@/components/new-modals/simple-task-modal';
import { SimpleResourceModal } from '@/components/new-modals/simple-resource-modal';
import { TestPopupTrigger } from '@/components/test-popup';
import { PopupTestButtons } from '@/components/popup-test-buttons';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/storage';

interface DashboardProps {
  userProfile: UserProfile | null;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    <div className="space-y-8 animate-fade-in">
      <DashboardOverview 
        onAddTask={() => setIsTaskModalOpen(true)} 
        userProfile={userProfile}
      />
      
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

      {/* Test Popup */}
      <TestPopupTrigger />
      <PopupTestButtons />
      
      {/* Modals */}
      <SimpleTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
      
      <SimpleResourceModal
        open={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onResourceCreated={handleResourceCreated}
      />
    </div>
  );
}
