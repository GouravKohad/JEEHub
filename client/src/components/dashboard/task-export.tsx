import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Share2, Download, GraduationCap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Task } from '@shared/schema';

interface TaskExportProps {
  tasks: Task[];
  userName: string;
}

export function TaskExport({ tasks, userName }: TaskExportProps) {
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (exportRef.current === null) return;
    
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0px',
        }
      });
      saveAs(dataUrl, `jee-hub-targets-${new Date().toISOString().split('T')[0]}.png`);
    } catch (err) {
      console.error('Error exporting image:', err);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover-elevate">
          <Share2 className="mr-2 h-4 w-4" />
          Share Targets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Daily Targets</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="border rounded-lg overflow-hidden bg-muted p-4">
            <div 
              ref={exportRef}
              className="w-full aspect-[4/5] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 flex flex-col text-white font-inter"
              style={{ width: '400px' }} // Fixed width for consistent export
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">JEE Hub</h2>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Study Manager</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">{today}</p>
                </div>
              </div>

              {/* Title Section */}
              <div className="mb-6">
                <h3 className="text-3xl font-extrabold mb-1">Today's Targets</h3>
                <p className="text-sm text-white/80 font-medium">Preparation Goals for {userName}</p>
              </div>

              <Separator className="bg-white/20 mb-6" />

              {/* Tasks List */}
              <div className="flex-1 space-y-4 overflow-hidden">
                {tasks.length > 0 ? (
                  tasks.slice(0, 6).map((task) => (
                    <div key={task.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-start space-x-3">
                      <div className="mt-1">
                        <Target size={18} className="text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded-full">{task.subject}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${
                            task.priority === 'high' ? 'bg-red-500/50' : 
                            task.priority === 'medium' ? 'bg-amber-500/50' : 'bg-blue-500/50'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm font-semibold truncate leading-tight">{task.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/60 text-center">
                    <p className="text-sm font-medium">No targets set for today yet.</p>
                  </div>
                )}
                {tasks.length > 6 && (
                  <p className="text-[10px] text-center text-white/60 italic">And {tasks.length - 6} more targets...</p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <p className="text-xs font-bold text-white tracking-wide">Powered By JEE Hub</p>
                  <p className="text-[10px] text-white/60 font-medium">jeehub.app</p>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Perfect for YouTube posts, community updates, and social sharing.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
