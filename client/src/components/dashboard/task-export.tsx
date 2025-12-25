import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Share2, Download, GraduationCap, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@shared/schema';

interface TaskExportProps {
  tasks: Task[];
  userName: string;
}

export function TaskExport({ tasks, userName }: TaskExportProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (exportRef.current === null) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure any layout shifts are settled
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        // Using a filter to ensure only the target is captured without parent styles
        filter: (node) => {
          return node.id !== 'share-dialog-overlay';
        }
      });
      
      saveAs(dataUrl, `jee-hub-targets-${new Date().toISOString().split('T')[0]}.png`);
      
      toast({
        title: "Targets Exported!",
        description: "Your daily targets image has been downloaded.",
      });
    } catch (err) {
      console.error('Error exporting image:', err);
      toast({
        title: "Export Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const exportContent = (
    <div 
      ref={exportRef}
      className="bg-gradient-to-br from-[#4F46E5] via-[#9333EA] to-[#EC4899] p-8 flex flex-col text-white font-inter"
      style={{ width: '400px', height: '500px', position: 'fixed', left: '-9999px', top: '-9999px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-none">JEE HUB</h2>
            <p className="text-[10px] text-white/80 uppercase tracking-[0.2em] font-bold mt-1">Study Manager</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/10">{today}</p>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h3 className="text-4xl font-black mb-2 tracking-tight">Today's Targets</h3>
        <div className="flex items-center space-x-2">
          <div className="h-1 w-12 bg-white/40 rounded-full" />
          <p className="text-sm text-white/90 font-semibold tracking-wide">Ready for {userName}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 space-y-3.5 overflow-hidden">
        {tasks.length > 0 ? (
          tasks.slice(0, 6).map((task) => (
            <div key={task.id} className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Target size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-white/20 rounded-md tracking-wider uppercase">{task.subject}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-400' : 
                    task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                </div>
                <p className="text-sm font-bold truncate leading-tight tracking-tight">{task.title}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/60 text-center space-y-3">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-dashed border-white/30">
              <Target size={32} className="opacity-40" />
            </div>
            <p className="text-base font-bold">No targets set for today yet.</p>
          </div>
        )}
        {tasks.length > 6 && (
          <div className="pt-2 text-center">
            <span className="text-[11px] font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
              + {tasks.length - 6} more targets for today
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-white/20 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap size={14} className="text-indigo-600" />
          </div>
          <p className="text-sm font-black text-white tracking-widest">POWERED BY JEE HUB</p>
        </div>
        <p className="text-[10px] text-white/60 font-bold tracking-[0.3em]">WWW.JEEHUB.APP</p>
      </div>
    </div>
  );

  return (
    <>
      {exportContent}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="hover-elevate bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300"
            data-testid="button-share-targets"
          >
            <Share2 className="mr-2 h-4 w-4 text-primary" />
            Share Targets
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Share2 className="mr-2 h-5 w-5 text-primary" />
              Export Daily Targets
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-6">
            <div className="relative border rounded-2xl overflow-hidden shadow-inner bg-black/5 dark:bg-white/5 p-4 flex justify-center">
              {/* Preview version (no fixed position) */}
              <div 
                className="w-full max-w-full aspect-[4/5] bg-gradient-to-br from-[#4F46E5] via-[#9333EA] to-[#EC4899] p-8 flex flex-col text-white font-inter rounded-xl"
                style={{ width: '100%', maxWidth: '300px' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tight leading-none">JEE HUB</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded-full">{today}</span>
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight">Today's Targets</h3>
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/20 rounded-xl">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Image Preview</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                data-testid="button-download-image"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download PNG
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground font-medium px-4">
                Tip: Post this on your YouTube Community or PW Groups!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
