import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Upload, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onAddTask: () => void;
  onUploadFile: () => void;
  onStartTimer: () => void;
}

export function FloatingActionButton({ onAddTask, onUploadFile, onStartTimer }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* FAB Menu Items */}
        <div
          className={cn(
            "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <Button
            size="sm"
            className="w-12 h-12 bg-physics hover:bg-physics/90 text-white rounded-full shadow-lg hover:shadow-xl hover-lift transition-all duration-300"
            onClick={() => handleAction(onAddTask)}
            title="Add Task"
            data-testid="fab-add-task"
          >
            <CheckSquare className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 bg-chemistry hover:bg-chemistry/90 text-white rounded-full shadow-lg hover:shadow-xl hover-lift transition-all duration-300"
            onClick={() => handleAction(onUploadFile)}
            title="Upload File"
            data-testid="fab-upload-file"
          >
            <Upload className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 bg-mathematics hover:bg-mathematics/90 text-white rounded-full shadow-lg hover:shadow-xl hover-lift transition-all duration-300"
            onClick={() => handleAction(onStartTimer)}
            title="Start Timer"
            data-testid="fab-start-timer"
          >
            <Clock className="h-5 w-5" />
          </Button>
        </div>

        {/* Main FAB */}
        <Button
          size="lg"
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover-lift transition-all duration-300"
          onClick={toggleMenu}
          data-testid="fab-main"
        >
          <Plus className={cn("h-6 w-6 transition-transform duration-300", isOpen && "rotate-45")} />
        </Button>
      </div>
    </div>
  );
}
