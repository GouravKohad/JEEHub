import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { taskStorage, userStatsStorage, type UserProfile } from '@/lib/storage';
import { useMemo } from 'react';

interface DashboardOverviewProps {
  onAddTask: () => void;
  userProfile: UserProfile | null;
}

export function DashboardOverview({ onAddTask, userProfile }: DashboardOverviewProps) {
  const stats = useMemo(() => {
    const userStats = userStatsStorage.get();
    const taskStats = taskStorage.getStats();
    
    return {
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      studyHours: Math.round(userStats.totalStudyTime / 60 * 10) / 10, // Convert to hours
      streak: userStats.currentStreak,
      completionRate: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0,
    };
  }, []);

  const progressData = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      progress: 75,
      icon: '📋',
      change: '+12%',
      color: 'bg-blue-600',
    },
    {
      title: 'Study Hours',
      value: `${stats.studyHours}h`,
      progress: 80,
      icon: '⏰',
      change: `+${stats.studyHours}h`,
      color: 'bg-green-600',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      progress: stats.completionRate,
      icon: '📊',
      change: `${stats.completionRate}%`,
      color: 'bg-purple-600',
    },
    {
      title: 'Day Streak',
      value: stats.streak,
      progress: Math.min((stats.streak / 30) * 100, 100),
      icon: '🏆',
      change: `${stats.streak} days`,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-jee-primary">{userProfile?.name || 'Student'}</span>!
          </h2>
          <p className="text-jee-muted">Track your JEE preparation progress and stay on top of your goals.</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button
            onClick={onAddTask}
            className="bg-jee-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            data-testid="button-add-task"
          >
            <Plus className="mr-2" size={18} />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressData.map((item, index) => (
          <Card
            key={item.title}
            className="p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div className="flex items-center text-sm font-medium text-jee-secondary">
                  <TrendingUp size={14} className="mr-1" />
                  {item.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid={`stat-${item.title.toLowerCase().replace(' ', '-')}`}>
                {item.value}
              </h3>
              <p className="text-jee-muted text-sm mb-4">{item.title}</p>
              <Progress 
                value={item.progress} 
                className="h-2"
                data-testid={`progress-${item.title.toLowerCase().replace(' ', '-')}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
