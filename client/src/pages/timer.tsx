import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Clock,
  Target,
  Trophy,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Timer() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customDuration, setCustomDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalStudiedToday, setTotalStudiedToday] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const presetDurations = [
    { label: "Pomodoro (25 min)", value: 25 },
    { label: "Short Break (5 min)", value: 5 },
    { label: "Long Break (15 min)", value: 15 },
    { label: "Deep Focus (45 min)", value: 45 },
    { label: "Extended (90 min)", value: 90 },
  ];

  const subjects = [
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Mathematics", value: "mathematics" },
  ];

  const createStudySessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/study-sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      toast({
        title: "Session Saved",
        description: "Your study session has been recorded!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save study session.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound (if browser supports it)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Session Complete!', {
        body: 'Time to take a break.',
        icon: '/favicon.ico'
      });
    }

    // Save study session if subject is selected and session was started
    if (selectedSubject && sessionStartTime) {
      const duration = Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60); // in minutes
      if (duration > 0) {
        createStudySessionMutation.mutate({
          subject: selectedSubject,
          duration: duration
        });
        setTotalStudiedToday(prev => prev + duration);
      }
    }

    toast({
      title: "Session Complete!",
      description: "Great job! Time to take a break.",
    });
  };

  const handleStart = () => {
    if (!selectedSubject) {
      toast({
        title: "Select Subject",
        description: "Please select a subject before starting the timer.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setSessionStartTime(new Date());

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    
    // Save partial session if it was running for more than 1 minute
    if (selectedSubject && sessionStartTime) {
      const duration = Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60);
      if (duration >= 1) {
        createStudySessionMutation.mutate({
          subject: selectedSubject,
          duration: duration
        });
        setTotalStudiedToday(prev => prev + duration);
      }
    }
    
    handleReset();
  };

  const handleReset = () => {
    setTimeLeft(customDuration * 60);
    setSessionStartTime(null);
  };

  const handleDurationChange = (duration: number) => {
    setCustomDuration(duration);
    if (!isRunning) {
      setTimeLeft(duration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = customDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'physics': return 'text-physics';
      case 'chemistry': return 'text-chemistry';
      case 'mathematics': return 'text-mathematics';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Study Timer</h2>
          <p className="text-muted-foreground">Focus on your studies with our Pomodoro timer</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Timer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Study Time</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="today-study-time">
                      {Math.floor(totalStudiedToday / 60)}h {totalStudiedToday % 60}m
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Session</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="current-session">
                      {selectedSubject ? selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1) : 'None'}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sessions Today</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="sessions-today">
                      0
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timer Settings */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Timer Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Preset Durations</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {presetDurations.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={customDuration === preset.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDurationChange(preset.value)}
                        disabled={isRunning}
                        className="justify-start"
                        data-testid={`preset-${preset.value}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-duration">Custom Duration (minutes)</Label>
                  <Input
                    id="custom-duration"
                    type="number"
                    min="1"
                    max="180"
                    value={customDuration}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value) || 25)}
                    disabled={isRunning}
                    data-testid="custom-duration"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timer Display */}
            <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Timer Circle */}
                  <div className="relative mx-auto w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted opacity-20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                        className={cn(
                          "transition-all duration-300",
                          selectedSubject ? getSubjectColor(selectedSubject) : "text-primary"
                        )}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-mono font-bold text-foreground" data-testid="timer-display">
                          {formatTime(timeLeft)}
                        </div>
                        {selectedSubject && (
                          <div className={cn("text-lg font-medium mt-2", getSubjectColor(selectedSubject))}>
                            {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    {!isRunning ? (
                      <Button
                        size="lg"
                        onClick={handleStart}
                        className="px-8 hover-lift"
                        data-testid="button-start"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handlePause}
                        className="px-8 hover-lift"
                        data-testid="button-pause"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleStop}
                      disabled={!isRunning && timeLeft === customDuration * 60}
                      className="px-8 hover-lift"
                      data-testid="button-stop"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isRunning}
                      className="px-8 hover-lift"
                      data-testid="button-reset"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Session Info */}
                  {sessionStartTime && (
                    <div className="text-sm text-muted-foreground">
                      Session started at {sessionStartTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips and Motivation */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🍅 Pomodoro Technique</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🎯 Stay Focused</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    During study sessions, avoid distractions. Keep your phone away and focus solely on the task at hand.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">💪 Build Consistency</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Regular short study sessions are more effective than occasional long cramming sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
