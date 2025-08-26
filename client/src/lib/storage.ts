import { nanoid } from 'nanoid';
import type { 
  Task, 
  InsertTask, 
  Resource, 
  InsertResource, 
  StudySession, 
  InsertStudySession,
  ScheduleItem,
  InsertScheduleItem,
  Activity,
  UserStats,
  Subject
} from '@shared/schema';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'jee_user_profile',
  TASKS: 'jee_tasks',
  RESOURCES: 'jee_resources',
  STUDY_SESSIONS: 'jee_study_sessions',
  SCHEDULE: 'jee_schedule',
  ACTIVITIES: 'jee_activities',
  USER_STATS: 'jee_user_stats',
} as const;

// User profile interface
export interface UserProfile {
  name: string;
  joinDate: string;
  lastActiveDate: string;
  preferences: {
    defaultSubject: Subject;
    defaultTimerDuration: number;
    theme: 'light' | 'dark';
  };
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

// Task management
export const taskStorage = {
  getAll: (): Task[] => getFromStorage(STORAGE_KEYS.TASKS, []),
  
  getById: (id: string): Task | undefined => {
    const tasks = taskStorage.getAll();
    return tasks.find(task => task.id === id);
  },
  
  getBySubject: (subject: Subject): Task[] => {
    const tasks = taskStorage.getAll();
    return tasks.filter(task => task.subject === subject);
  },
  
  create: (taskData: InsertTask): Task => {
    const tasks = taskStorage.getAll();
    const newTask: Task = {
      ...taskData,
      id: nanoid(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    
    // Add activity
    activityStorage.create({
      type: 'task_created',
      description: `Created task "${newTask.title}"`,
      subject: newTask.subject,
      timestamp: new Date().toISOString(),
    });
    
    // Update stats
    userStatsStorage.updateTaskCount();
    
    return newTask;
  },
  
  update: (id: string, updates: Partial<Task>): Task | null => {
    const tasks = taskStorage.getAll();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return null;
    
    const updatedTask = { ...tasks[index], ...updates };
    
    // Handle completion
    if (updates.status === 'completed' && tasks[index].status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
      
      // Add activity
      activityStorage.create({
        type: 'task_completed',
        description: `Completed task "${updatedTask.title}"`,
        subject: updatedTask.subject,
        timestamp: new Date().toISOString(),
      });
      
      // Update stats
      userStatsStorage.updateTaskCompletion();
    }
    
    tasks[index] = updatedTask;
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    
    return updatedTask;
  },
  
  delete: (id: string): boolean => {
    const tasks = taskStorage.getAll();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    saveToStorage(STORAGE_KEYS.TASKS, filteredTasks);
    return true;
  },
  
  getStats: () => {
    const tasks = taskStorage.getAll();
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      return task.status !== 'completed' && dueDate < now;
    }).length;
    
    return { total, completed, pending, inProgress, overdue };
  },
};

// Resource management
export const resourceStorage = {
  getAll: (): Resource[] => getFromStorage(STORAGE_KEYS.RESOURCES, []),
  
  getBySubject: (subject: Subject | 'General'): Resource[] => {
    const resources = resourceStorage.getAll();
    return resources.filter(resource => resource.subject === subject);
  },
  
  create: (resourceData: InsertResource): Resource => {
    const resources = resourceStorage.getAll();
    const newResource: Resource = {
      ...resourceData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    
    resources.push(newResource);
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);
    
    // Add activity
    activityStorage.create({
      type: 'resource_added',
      description: `Added resource "${newResource.title}"`,
      subject: newResource.subject === 'General' ? undefined : newResource.subject as Subject,
      timestamp: new Date().toISOString(),
    });
    
    return newResource;
  },
  
  delete: (id: string): boolean => {
    const resources = resourceStorage.getAll();
    const filteredResources = resources.filter(resource => resource.id !== id);
    
    if (filteredResources.length === resources.length) return false;
    
    saveToStorage(STORAGE_KEYS.RESOURCES, filteredResources);
    return true;
  },
};

// Study session management
export const studySessionStorage = {
  getAll: (): StudySession[] => getFromStorage(STORAGE_KEYS.STUDY_SESSIONS, []),
  
  create: (sessionData: InsertStudySession): StudySession => {
    const sessions = studySessionStorage.getAll();
    const newSession: StudySession = {
      ...sessionData,
      id: nanoid(),
    };
    
    sessions.push(newSession);
    saveToStorage(STORAGE_KEYS.STUDY_SESSIONS, sessions);
    
    // Add activity
    activityStorage.create({
      type: 'study_session',
      description: `Studied ${sessionData.subject} for ${sessionData.duration} minutes`,
      subject: sessionData.subject,
      timestamp: new Date().toISOString(),
    });
    
    // Update stats
    userStatsStorage.updateStudyTime(sessionData.duration);
    
    return newSession;
  },
  
  getTodaysSessions: (): StudySession[] => {
    const sessions = studySessionStorage.getAll();
    const today = new Date().toDateString();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime).toDateString();
      return sessionDate === today;
    });
  },
  
  getBySubject: (subject: Subject): StudySession[] => {
    const sessions = studySessionStorage.getAll();
    return sessions.filter(session => session.subject === subject);
  },
};

// Schedule management
export const scheduleStorage = {
  getAll: (): ScheduleItem[] => getFromStorage(STORAGE_KEYS.SCHEDULE, []),
  
  getTodaysSchedule: (): ScheduleItem[] => {
    const schedule = scheduleStorage.getAll();
    const today = new Date().toISOString().split('T')[0];
    
    return schedule.filter(item => item.date === today);
  },
  
  create: (scheduleData: InsertScheduleItem): ScheduleItem => {
    const schedule = scheduleStorage.getAll();
    const newItem: ScheduleItem = {
      ...scheduleData,
      id: nanoid(),
      completed: false,
    };
    
    schedule.push(newItem);
    saveToStorage(STORAGE_KEYS.SCHEDULE, schedule);
    
    return newItem;
  },
  
  update: (id: string, updates: Partial<ScheduleItem>): ScheduleItem | null => {
    const schedule = scheduleStorage.getAll();
    const index = schedule.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...schedule[index], ...updates };
    schedule[index] = updatedItem;
    saveToStorage(STORAGE_KEYS.SCHEDULE, schedule);
    
    return updatedItem;
  },
  
  delete: (id: string): boolean => {
    const schedule = scheduleStorage.getAll();
    const filteredSchedule = schedule.filter(item => item.id !== id);
    
    if (filteredSchedule.length === schedule.length) return false;
    
    saveToStorage(STORAGE_KEYS.SCHEDULE, filteredSchedule);
    return true;
  },
};

// Activity management
export const activityStorage = {
  getAll: (): Activity[] => getFromStorage(STORAGE_KEYS.ACTIVITIES, []),
  
  getRecent: (limit: number = 10): Activity[] => {
    const activities = activityStorage.getAll();
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  
  create: (activityData: Omit<Activity, 'id'>): Activity => {
    const activities = activityStorage.getAll();
    const newActivity: Activity = {
      ...activityData,
      id: nanoid(),
    };
    
    activities.push(newActivity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(0, activities.length - 100);
    }
    
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    
    return newActivity;
  },
};

// User stats management
export const userStatsStorage = {
  get: (): UserStats => getFromStorage(STORAGE_KEYS.USER_STATS, {
    totalTasks: 0,
    completedTasks: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    subjectProgress: {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0,
    },
  }),
  
  updateTaskCount: (): void => {
    const stats = userStatsStorage.get();
    const taskStats = taskStorage.getStats();
    
    const updatedStats = {
      ...stats,
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
    };
    
    // Update subject progress
    ['Physics', 'Chemistry', 'Mathematics'].forEach(subject => {
      const subjectTasks = taskStorage.getBySubject(subject as Subject);
      const completedSubjectTasks = subjectTasks.filter(task => task.status === 'completed');
      const progress = subjectTasks.length > 0 ? (completedSubjectTasks.length / subjectTasks.length) * 100 : 0;
      updatedStats.subjectProgress[subject as Subject] = Math.round(progress);
    });
    
    saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
  },
  
  updateTaskCompletion: (): void => {
    userStatsStorage.updateTaskCount();
    userStatsStorage.updateStreak();
  },
  
  updateStudyTime: (minutes: number): void => {
    const stats = userStatsStorage.get();
    const updatedStats = {
      ...stats,
      totalStudyTime: stats.totalStudyTime + minutes,
      lastStudyDate: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    userStatsStorage.updateStreak();
  },
  
  updateStreak: (): void => {
    const stats = userStatsStorage.get();
    const today = new Date().toDateString();
    const lastStudyDate = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;
    
    let newStreak = stats.currentStreak;
    
    if (lastStudyDate === today) {
      // Already studied today, keep streak
      return;
    } else if (lastStudyDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastStudyDate === yesterdayString) {
        // Studied yesterday, increment streak
        newStreak = stats.currentStreak + 1;
      } else {
        // Gap in studying, reset streak
        newStreak = 1;
      }
    } else {
      // First time studying
      newStreak = 1;
    }
    
    const updatedStats = {
      ...stats,
      currentStreak: newStreak,
      lastStudyDate: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
  },
};

// User profile management
export const userProfileStorage = {
  get: (): UserProfile | null => {
    try {
      const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return null;
    }
  },

  create: (name: string): UserProfile => {
    const profile: UserProfile = {
      name: name.trim(),
      joinDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      preferences: {
        defaultSubject: 'Physics',
        defaultTimerDuration: 25,
        theme: 'light',
      },
    };
    
    saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
    return profile;
  },

  update: (updates: Partial<UserProfile>): UserProfile | null => {
    const existingProfile = userProfileStorage.get();
    if (!existingProfile) return null;
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      lastActiveDate: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    return updatedProfile;
  },

  updateLastActive: (): void => {
    const profile = userProfileStorage.get();
    if (profile) {
      userProfileStorage.update({ lastActiveDate: new Date().toISOString() });
    }
  },

  isFirstTime: (): boolean => {
    return userProfileStorage.get() === null;
  },
};

// Initialize default data
export const initializeDefaultData = (): void => {
  // Create some default resources if none exist
  const existingResources = resourceStorage.getAll();
  if (existingResources.length === 0) {
    const defaultResources = [
      {
        title: "NCERT Physics Solutions",
        url: "https://ncert.nic.in/textbook.php?leph1=0-10",
        description: "Complete solutions for NCERT Physics textbook",
        subject: "Physics" as const,
        category: "book" as const,
      },
      {
        title: "Khan Academy Chemistry",
        url: "https://www.khanacademy.org/science/chemistry",
        description: "Free online chemistry courses and tutorials",
        subject: "Chemistry" as const,
        category: "video" as const,
      },
      {
        title: "Math Formula Reference",
        url: "https://en.wikipedia.org/wiki/List_of_mathematical_formulas",
        description: "Comprehensive list of mathematical formulas",
        subject: "Mathematics" as const,
        category: "website" as const,
      },
    ];
    
    defaultResources.forEach(resource => {
      resourceStorage.create(resource);
    });
  }
  
  // Update last active date if user exists
  userProfileStorage.updateLastActive();
};
