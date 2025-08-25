import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskModal } from "@/components/task-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get filter from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    if (subject) {
      setSubjectFilter(subject);
    }
  }, []);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
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

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task.",
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

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = subjectFilter === "all" || task.subject === subjectFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "pending" && !task.completed);

    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  });

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

  const getStatusIcon = (task: any) => {
    if (task.completed) {
      return <CheckSquare className="h-4 w-4 text-green-600" />;
    }
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return `Due ${date.toLocaleDateString()}`;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
            <p className="text-muted-foreground">Manage your study tasks and assignments</p>
          </div>
          <Button
            onClick={() => setIsTaskModalOpen(true)}
            className="hover-lift"
            data-testid="button-add-task"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-tasks"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-40" data-testid="filter-subject">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32" data-testid="filter-priority">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32" data-testid="filter-status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tasks ({filteredTasks.length})</span>
              <Filter className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-lg border hover:bg-accent hover-lift transition-colors",
                      getSubjectColor(task.subject)
                    )}
                    data-testid={`task-${task.id}`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                      data-testid={`checkbox-${task.id}`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(task)}
                        <h3 className={cn(
                          "font-medium",
                          task.completed && "line-through opacity-60"
                        )}>
                          {task.title}
                        </h3>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          {task.subject ? task.subject.charAt(0).toUpperCase() + task.subject.slice(1) : 'No subject'}
                        </span>
                        <span>{formatDueDate(task.dueDate)}</span>
                        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`menu-${task.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {/* TODO: Edit task */}}
                            data-testid={`edit-${task.id}`}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600"
                            data-testid={`delete-${task.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || subjectFilter !== "all" || priorityFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first task to get started"
                  }
                </p>
                <Button
                  onClick={() => setIsTaskModalOpen(true)}
                  data-testid="button-create-first-task"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
}
