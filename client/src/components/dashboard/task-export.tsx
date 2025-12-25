import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Share2, GraduationCap, Target, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#020617',
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        style: {
          visibility: 'visible',
          opacity: '1',
        }
      });
      
      saveAs(dataUrl, `jee-hub-targets-${new Date().toISOString().split('T')[0]}.png`);
      
      toast({
        title: "Targets Exported!",
        description: "Your 1080x1080 target card is ready!",
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

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none overflow-hidden" 
        style={{ width: '1080px', height: '1080px', zIndex: -1000, opacity: 0.01 }}
      >
        <div 
          ref={exportRef}
          className="bg-[#020617] flex flex-col text-white font-inter overflow-hidden relative"
          style={{ width: '1080px', height: '1080px' }}
        >
          <div className="absolute top-[-5%] right-[-5%] w-[70%] h-[70%] bg-indigo-600/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[60%] bg-purple-600/25 blur-[110px] rounded-full" />
          <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[90px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 flex flex-col h-full p-16">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center border border-white/20">
                  <GraduationCap size={44} className="text-white" />
                </div>
                <div>
                  <h2 className="text-5xl font-black tracking-tighter leading-none text-white">JEE HUB</h2>
                  <p className="text-lg text-indigo-400 font-black uppercase tracking-[0.4em] mt-2">Study Manager</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl backdrop-blur-md">
                <p className="text-xl font-bold text-white/90 tracking-wide">{today}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Sparkles size={28} className="text-amber-400" />
                <span className="text-2xl font-black text-indigo-400/80 tracking-[0.3em] uppercase">Daily Mission</span>
              </div>
              <h3 className="text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                Today's Targets
              </h3>
              <p className="text-3xl text-white/90 font-black tracking-tight">
                For <span className="text-indigo-400">{userName}</span>
              </p>
            </div>

            <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
              {tasks.length > 0 ? (
                tasks.slice(0, 10).map((task) => {
                  // Dynamically calculate padding and text sizes based on task count
                  const taskCount = Math.min(tasks.length, 10);
                  const isCompact = taskCount > 4;
                  const isVeryCompact = taskCount > 7;
                  
                  const paddingClass = isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-6';
                  const titleSize = isVeryCompact ? 'text-lg' : isCompact ? 'text-xl' : 'text-2xl';
                  const iconSize = isVeryCompact ? 20 : isCompact ? 24 : 28;
                  const badgeSize = isVeryCompact ? 'text-[9px]' : isCompact ? 'text-[10px]' : 'text-sm';
                  const containerSize = isVeryCompact ? 'w-10 h-10' : isCompact ? 'w-12 h-12' : 'w-14 h-14';

                  return (
                    <div 
                      key={task.id} 
                      className={`bg-white/[0.04] border border-white/10 rounded-[24px] flex items-center space-x-4 ${paddingClass}`}
                    >
                      <div className={`rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${containerSize} ${
                        task.subject === 'Physics' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' : 
                        task.subject === 'Chemistry' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 
                        'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                      }`}>
                        <Target size={iconSize} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-black px-2 py-0.5 bg-white/10 rounded-md tracking-widest uppercase text-white/80 ${badgeSize}`}>{task.subject}</span>
                          <div className="flex items-center space-x-2">
                             <span className={`font-black uppercase px-2 py-0.5 rounded-md ${badgeSize} ${
                                task.priority === 'high' ? 'bg-red-500/30 text-red-300' : 
                                task.priority === 'medium' ? 'bg-amber-500/30 text-amber-300' : 'bg-blue-500/30 text-blue-300'
                              }`}>
                                {task.priority}
                              </span>
                          </div>
                        </div>
                        <p className={`font-black truncate text-white tracking-tight ${titleSize}`}>{task.title}</p>
                        {task.description && !isCompact && (
                          <p className="text-base text-white/60 font-medium truncate italic leading-tight mt-1">{task.description}</p>
                        )}
                      </div>
                      {task.status === 'completed' && (
                        <div className={`${isVeryCompact ? 'w-8 h-8' : isCompact ? 'w-10 h-10' : 'w-12 h-12'} bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 border border-emerald-400/40`}>
                          <CheckCircle2 size={isVeryCompact ? 16 : isCompact ? 20 : 24} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-white/20 text-center space-y-6">
                  <Target size={80} className="opacity-20" />
                  <p className="text-4xl font-black tracking-tight uppercase opacity-50">No targets set</p>
                </div>
              )}
            </div>

            <div className="pt-10 mt-auto border-t border-white/10 flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <GraduationCap size={24} className="text-slate-950" />
                </div>
                <p className="text-3xl font-black text-white tracking-[0.4em] leading-none uppercase">POWERED BY JEE HUB</p>
              </div>
              <p className="text-lg text-white/40 font-black tracking-[0.8em] uppercase">JEEHUB.ONRENDER.COM</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleExport} 
        disabled={isExporting}
        variant="outline" 
        className="hover-elevate bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300"
        data-testid="button-share-targets"
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="mr-2 h-4 w-4 text-primary" />
        )}
        {isExporting ? 'Generating Image...' : 'Share Targets'}
      </Button>
    </>
  );
}
