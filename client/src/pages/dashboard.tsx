import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FloatingActionButton } from "@/components/floating-action-button";
import { TaskModal } from "@/components/task-modal";
import { FileUploadDropzone } from "@/components/file-upload-dropzone";
import { PDFPreviewModal } from "@/components/pdf-preview-modal";
import { 
  CheckSquare, 
  Clock, 
  FileText, 
  TrendingUp,
  Search,
  User,
  Flame,
  Plus,
  Play,
  Upload as UploadIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<any[]>({
    queryKey: ["/api/files"],
  });

  const { data: performance = [], isLoading: performanceLoading } = useQuery<any[]>({
    queryKey: ["/api/performance"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    },
  });

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { completed: !completed }
    });
  };

  const handleFilePreview = (file: any) => {
    setSelectedFile(file);
    setIsPDFPreviewOpen(true);
  };

  const recentTasks = tasks.slice(0, 3);
  const recentFiles = files.slice(0, 4);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getSubjectPerformance = (subject: string) => {
    const perf = performance.find((p: any) => p.subject === subject);
    return perf ? Math.round((perf.completedTasks / Math.max(perf.totalTasks, 1)) * 100) : 0;
  };

  const getTotalStudyHours = () => {
    return performance.reduce((total: number, perf: any) => total + Math.floor(perf.totalStudyTime / 60), 0);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics': return 'subject-physics';
      case 'chemistry': return 'subject-chemistry';
      case 'mathematics': return 'subject-mathematics';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'text-red-600';
    if (mimeType.includes('word')) return 'text-blue-600';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Let's continue your JEE preparation.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search tasks, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            {/* Profile */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover-lift">
              <User className="text-white h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-total-tasks">
                    {totalTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <CheckSquare className="text-primary h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{tasks.filter((t: any) => new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}%</span>
                <span className="text-muted-foreground ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-completed-tasks">
                    {completedTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
                  <CheckSquare className="text-green-500 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{completionRate}%</span>
                <span className="text-muted-foreground ml-2">completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-study-hours">
                    {getTotalStudyHours()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
                  <Clock className="text-blue-500 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-600 font-medium">0h</span>
                <span className="text-muted-foreground ml-2">today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Files</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-total-files">
                    {files.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-full flex items-center justify-center">
                  <FileText className="text-purple-500 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600 font-medium">{files.filter((f: any) => new Date(f.uploadedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}</span>
                <span className="text-muted-foreground ml-2">added today</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <Card className="animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Tasks</CardTitle>
                  <Link href="/tasks">
                    <Button variant="ghost" size="sm" className="hover-lift" data-testid="link-view-all-tasks">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : recentTasks.length > 0 ? (
                  recentTasks.map((task: any) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center space-x-4 p-4 rounded-lg border hover:bg-accent hover-lift",
                        getSubjectColor(task.subject)
                      )}
                      data-testid={`task-item-${task.id}`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                        data-testid={`task-checkbox-${task.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          task.completed && "line-through opacity-60"
                        )}>
                          {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.subject ? task.subject.charAt(0).toUpperCase() + task.subject.slice(1) : 'No subject'} • {
                            task.dueDate 
                              ? new Date(task.dueDate) > new Date() 
                                ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                                : 'Overdue'
                              : 'No due date'
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks yet</p>
                    <Button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="mt-2"
                      data-testid="button-create-first-task"
                    >
                      Create your first task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div>
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Progress */}
                <div className="space-y-4">
                  {['Physics', 'Chemistry', 'Mathematics'].map((subject) => {
                    const progress = getSubjectPerformance(subject.toLowerCase());
                    return (
                      <div key={subject}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{subject}</span>
                          <span className="text-sm text-muted-foreground" data-testid={`progress-${subject.toLowerCase()}`}>
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                {/* Study Streak */}
                <div className="bg-gradient-to-r from-primary to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold" data-testid="study-streak">0 Day Streak!</p>
                      <p className="text-sm opacity-90">Start studying to build your streak!</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full hover-lift"
                    onClick={() => setIsTaskModalOpen(true)}
                    data-testid="button-quick-add-task"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full hover-lift"
                    onClick={() => {/* TODO: Start timer */}}
                    data-testid="button-quick-start-timer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Study Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Files */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Files</CardTitle>
              <Link href="/files">
                <Button variant="ghost" size="sm" className="hover-lift" data-testid="link-view-all-files">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {filesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentFiles.map((file: any) => (
                  <div
                    key={file.id}
                    className="border rounded-lg p-4 hover:bg-accent hover-lift cursor-pointer"
                    onClick={() => handleFilePreview(file)}
                    data-testid={`file-item-${file.id}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className={cn("h-5 w-5", getFileIcon(file.mimeType))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{file.subject ? file.subject.charAt(0).toUpperCase() + file.subject.slice(1) : 'General'}</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}

                {/* Upload File Card */}
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 hover-lift cursor-pointer transition-colors"
                  onClick={() => setIsFileUploadOpen(true)}
                  data-testid="upload-file-card"
                >
                  <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Upload File</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, XLS</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onAddTask={() => setIsTaskModalOpen(true)}
        onUploadFile={() => setIsFileUploadOpen(true)}
        onStartTimer={() => {/* TODO: Navigate to timer */}}
      />

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <FileUploadDropzone
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
      />

      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        file={selectedFile}
      />
    </div>
  );
}
