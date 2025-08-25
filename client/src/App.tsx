import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Files from "@/pages/files";
import Performance from "@/pages/performance";
import Timer from "@/pages/timer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/files" component={Files} />
        <Route path="/performance" component={Performance} />
        <Route path="/timer" component={Timer} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
