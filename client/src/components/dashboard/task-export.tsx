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
      // Small delay to ensure any layout shifts are settled and fonts are ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#0F172A', // Dark professional background
        width: 1080,
        height: 1080,
        pixelRatio: 1, // Already 1080x1080
        skipAutoScale: true,
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
      {/* Off-screen export container (1080x1080) */}
      <div 
        ref={exportRef}
        className="bg-slate-950 flex flex-col text-white font-inter overflow-hidden relative"
        style={{ 
          width: '1080px', 
          height: '1080px', 
          position: 'fixed', 
          left: '-9999px', 
          top: '-9999px',
          zIndex: -100
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col h-full p-16">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10">
                <GraduationCap size={44} className="text-white" />
              </div>
              <div>
                <h2 className="text-5xl font-black tracking-tighter leading-none text-white">JEE HUB</h2>
                <p className="text-lg text-indigo-400 font-bold uppercase tracking-[0.4em] mt-2">Study Manager</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl backdrop-blur-md shadow-xl">
              <p className="text-xl font-bold text-white/90 tracking-wide">{today}</p>
            </div>
          </div>

          {/* User & Title Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-4 mb-4">
              <Sparkles size={28} className="text-amber-400" />
              <span className="text-2xl font-bold text-white/60 tracking-widest uppercase">Daily Mission</span>
            </div>
            <h3 className="text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 leading-[1.1]">
              Today's<br />Targets
            </h3>
            <p className="text-3xl text-indigo-300 font-bold mt-6 tracking-wide flex items-center">
              <span className="w-12 h-1 bg-indigo-500 rounded-full mr-4" />
              Set for {userName}
            </p>
          </div>

          {/* Tasks Grid */}
          <div className="flex-1 grid grid-cols-1 gap-6 mb-16">
            {tasks.length > 0 ? (
              tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 flex items-center space-x-8 shadow-2xl backdrop-blur-sm hover:bg-white/[0.05] transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    task.subject === 'Physics' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                    task.subject === 'Chemistry' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <Target size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-black px-4 py-1 bg-white/10 rounded-xl tracking-wider uppercase text-white/90">{task.subject}</span>
                      <div className="flex items-center space-x-3">
                         <span className={`text-sm font-black uppercase px-3 py-1 rounded-lg ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                            task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {task.priority} Priority
                          </span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold truncate text-white leading-tight">{task.title}</p>
                  </div>
                  {task.status === 'completed' && (
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/20 text-center space-y-6">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/10">
                  <Target size={64} className="opacity-20" />
                </div>
                <p className="text-4xl font-black tracking-tight">Focusing for tomorrow...</p>
              </div>
            )}
            {tasks.length > 5 && (
              <div className="text-center pt-4">
                <span className="text-xl font-bold text-white/40 bg-white/5 px-8 py-3 rounded-full border border-white/5">
                  + {tasks.length - 5} additional mission targets
                </span>
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div className="pt-12 border-t border-white/10 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap size={24} className="text-slate-950" />
              </div>
              <p className="text-3xl font-black text-white tracking-[0.3em]">POWERED BY JEE HUB</p>
            </div>
            <p className="text-lg text-white/40 font-bold tracking-[0.5em]">WWW.JEEHUB.APP</p>
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
