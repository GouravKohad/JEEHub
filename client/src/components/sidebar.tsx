import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  LayoutDashboard, 
  CheckSquare, 
  Folder, 
  TrendingUp, 
  Clock,
  Moon,
  Sun,
  Computer
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/files", icon: Folder, label: "Files" },
  { href: "/performance", icon: TrendingUp, label: "Performance" },
  { href: "/timer", icon: Clock, label: "Study Timer" },
];

const subjects = [
  { name: "Physics", color: "physics", count: 0 },
  { name: "Chemistry", color: "chemistry", count: 0 },
  { name: "Mathematics", color: "mathematics", count: 0 },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  const getSubjectTaskCount = (subject: string) => {
    return tasks.filter((task: any) => 
      task.subject?.toLowerCase() === subject.toLowerCase() && !task.completed
    ).length;
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Computer className="h-4 w-4" />;
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col transition-colors duration-300">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">StudySpace</h1>
            <p className="text-sm text-muted-foreground">JEE Prep Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover-lift cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Subject Quick Access */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">SUBJECTS</h3>
        <div className="space-y-2">
          {subjects.map((subject) => {
            const taskCount = getSubjectTaskCount(subject.name);
            return (
              <Link key={subject.name} href={`/tasks?subject=${subject.name.toLowerCase()}`}>
                <div 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer hover-lift transition-colors"
                  data-testid={`subject-${subject.name.toLowerCase()}`}
                >
                  <div className={`w-3 h-3 bg-${subject.color} rounded-full`}></div>
                  <span className="text-sm text-foreground">{subject.name}</span>
                  {taskCount > 0 && (
                    <span className={`ml-auto text-xs bg-${subject.color} text-white px-2 py-1 rounded-full`}>
                      {taskCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start space-x-2 hover-lift"
          data-testid="theme-toggle"
        >
          {getThemeIcon()}
          <span className="text-sm font-medium capitalize">{theme} Mode</span>
        </Button>
      </div>
    </aside>
  );
}
