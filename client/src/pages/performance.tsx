import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy,
  BookOpen,
  CheckCircle,
  Calendar,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Performance() {
  const { data: performance = [], isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const { data: studySessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/study-sessions"],
  });

  const subjects = [
    { name: 'Physics', key: 'physics', color: 'physics', icon: '⚡' },
    { name: 'Chemistry', key: 'chemistry', color: 'chemistry', icon: '🧪' },
    { name: 'Mathematics', key: 'mathematics', color: 'mathematics', icon: '📐' }
  ];

  const getSubjectPerformance = (subjectKey: string) => {
    return performance.find((p: any) => p.subject === subjectKey) || {
      totalTasks: 0,
      completedTasks: 0,
      totalStudyTime: 0
    };
  };

  const getSubjectTasks = (subjectKey: string) => {
    return tasks.filter((task: any) => task.subject === subjectKey);
  };

  const getRecentStudySessions = () => {
    return studySessions
      .slice(0, 5)
      .map((session: any) => ({
        ...session,
        date: new Date(session.date).toLocaleDateString(),
        duration: Math.floor(session.duration / 60) // Convert to hours
      }));
  };

  const getTotalStats = () => {
    const totalTasks = performance.reduce((sum: number, p: any) => sum + p.totalTasks, 0);
    const completedTasks = performance.reduce((sum: number, p: any) => sum + p.completedTasks, 0);
    const totalStudyTime = performance.reduce((sum: number, p: any) => sum + p.totalStudyTime, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      totalStudyTime: Math.floor(totalStudyTime / 60), // Convert to hours
      completionRate,
      studyStreak: 0 // TODO: Calculate actual streak
    };
  };

  const getWeeklyProgress = () => {
    // Mock weekly data - in real app, this would be calculated from actual data
    return [
      { day: 'Mon', hours: 3 },
      { day: 'Tue', hours: 4 },
      { day: 'Wed', hours: 2 },
      { day: 'Thu', hours: 5 },
      { day: 'Fri', hours: 3 },
      { day: 'Sat', hours: 6 },
      { day: 'Sun', hours: 4 }
    ];
  };

  const stats = getTotalStats();
  const weeklyProgress = getWeeklyProgress();
  const recentSessions = getRecentStudySessions();

  if (performanceLoading || tasksLoading || sessionsLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="h-16 bg-muted animate-pulse rounded"></div>
        </header>
        <div className="p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Performance</h2>
          <p className="text-muted-foreground">Track your progress and analyze your study patterns</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="completion-rate">
                    {stats.completionRate}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="total-tasks">
                    {stats.totalTasks}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="total-study-hours">
                    {stats.totalStudyTime}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="study-streak">
                    {stats.studyStreak}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg/Day</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="avg-daily-hours">
                    {Math.round((stats.totalStudyTime / 7) * 10) / 10}h
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Subject-wise Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjects.map((subject) => {
                const perf = getSubjectPerformance(subject.key);
                const completionRate = perf.totalTasks > 0 ? Math.round((perf.completedTasks / perf.totalTasks) * 100) : 0;
                const studyHours = Math.floor(perf.totalStudyTime / 60);
                
                return (
                  <div key={subject.key} className="space-y-3" data-testid={`subject-performance-${subject.key}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{subject.icon}</span>
                        <div>
                          <h3 className="font-medium">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {perf.completedTasks}/{perf.totalTasks} tasks • {studyHours}h studied
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={cn(
                            "text-white",
                            completionRate >= 80 ? "bg-green-500" :
                            completionRate >= 60 ? "bg-yellow-500" : "bg-red-500"
                          )}
                        >
                          {completionRate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Weekly Study Hours */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Weekly Study Pattern</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4" data-testid={`weekly-day-${day.day}`}>
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(day.hours / 8) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{day.hours}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Study Sessions */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Study Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session: any, index: number) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent hover-lift"
                    data-testid={`session-${session.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        session.subject === 'physics' && "bg-physics",
                        session.subject === 'chemistry' && "bg-chemistry",
                        session.subject === 'mathematics' && "bg-mathematics"
                      )}></div>
                      <div>
                        <p className="font-medium">
                          {session.subject.charAt(0).toUpperCase() + session.subject.slice(1)} Study Session
                        </p>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Math.floor(session.duration / 60)}h {session.duration % 60}m</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No study sessions recorded yet</p>
                <p className="text-sm text-muted-foreground mt-2">Start using the study timer to track your sessions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Study Consistency</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {stats.studyStreak > 0 ? `Great job! You're on a ${stats.studyStreak}-day streak.` : "Start building a study streak by studying daily."}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Task Completion</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {stats.completionRate >= 70 
                    ? "Excellent task completion rate! Keep it up." 
                    : "Focus on completing more tasks to improve your progress."
                  }
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Study Balance</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {subjects.every(s => getSubjectPerformance(s.key).totalStudyTime > 0)
                    ? "Great balance across all subjects!"
                    : "Try to balance your study time across all subjects."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
