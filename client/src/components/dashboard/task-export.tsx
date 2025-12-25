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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#020617', // Explicitly set background
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
      {/* 
          Robust Off-screen export container (1080x1080)
          We use visibility: hidden but absolute positioning so it's in the DOM and renderable by html-to-image
      */}
      <div 
        className="fixed top-0 left-0 pointer-events-none overflow-hidden" 
        style={{ width: '1080px', height: '1080px', zIndex: -1000, opacity: 0.01 }}
      >
        <div 
          ref={exportRef}
          className="bg-[#020617] flex flex-col text-white font-inter overflow-hidden relative"
          style={{ width: '1080px', height: '1080px' }}
        >
          {/* Decorative Background Elements - More robustly styled */}
          <div className="absolute top-[-5%] right-[-5%] w-[70%] h-[70%] bg-indigo-600/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[60%] bg-purple-600/25 blur-[110px] rounded-full" />
          <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[90px] rounded-full" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 flex flex-col h-full p-20">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-20">
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[28px] flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20">
                  <GraduationCap size={52} className="text-white" />
                </div>
                <div>
                  <h2 className="text-6xl font-black tracking-tighter leading-none text-white">JEE HUB</h2>
                  <p className="text-xl text-indigo-400 font-black uppercase tracking-[0.5em] mt-3">Study Manager</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-10 py-4 rounded-3xl backdrop-blur-md">
                <p className="text-2xl font-bold text-white/90 tracking-wide">{today}</p>
              </div>
            </div>

            {/* User & Title Section */}
            <div className="mb-20">
              <div className="flex items-center space-x-5 mb-6">
                <Sparkles size={36} className="text-amber-400" />
                <span className="text-3xl font-black text-indigo-400/80 tracking-[0.3em] uppercase">Daily Mission</span>
              </div>
              <h3 className="text-[120px] font-black tracking-tighter text-white leading-[0.9] mb-4">
                Today's<br />Targets
              </h3>
              <div className="flex items-center space-x-6 mt-10">
                <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-transparent rounded-full" />
                <p className="text-4xl text-white/90 font-black tracking-tight">
                  For <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-8">{userName}</span>
                </p>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="flex-1 flex flex-col space-y-6">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white/[0.04] border border-white/10 rounded-[36px] p-10 flex items-center space-x-10 shadow-2xl backdrop-blur-md"
                  >
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
                      task.subject === 'Physics' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' : 
                      task.subject === 'Chemistry' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 
                      'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                    }`}>
                      <Target size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-black px-5 py-1.5 bg-white/10 rounded-xl tracking-widest uppercase text-white/80">{task.subject}</span>
                        <div className="flex items-center space-x-4">
                           <span className={`text-base font-black uppercase px-4 py-1.5 rounded-xl ${
                              task.priority === 'high' ? 'bg-red-500/30 text-red-300' : 
                              task.priority === 'medium' ? 'bg-amber-500/30 text-amber-300' : 'bg-blue-500/30 text-blue-300'
                            }`}>
                              {task.priority} Priority
                            </span>
                        </div>
                      </div>
                      <p className="text-4xl font-black truncate text-white tracking-tight">{task.title}</p>
                    </div>
                    {task.status === 'completed' && (
                      <div className="w-16 h-16 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 size={36} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-white/20 text-center space-y-10">
                  <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/10">
                    <Target size={96} className="opacity-20" />
                  </div>
                  <p className="text-5xl font-black tracking-tight opacity-50 uppercase">Ready for tomorrow's grind</p>
                </div>
              )}
              {tasks.length > 5 && (
                <div className="text-center pt-8">
                  <span className="text-2xl font-black text-white/30 tracking-widest uppercase bg-white/5 px-12 py-4 rounded-full border border-white/10">
                    + {tasks.length - 5} More Targets Added
                  </span>
                </div>
              )}
            </div>

            {/* Footer Branding */}
            <div className="pt-16 mt-auto border-t border-white/10 flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <GraduationCap size={32} className="text-slate-950" />
                </div>
                <p className="text-4xl font-black text-white tracking-[0.4em] leading-none">POWERED BY JEE HUB</p>
              </div>
              <p className="text-xl text-white/40 font-black tracking-[0.8em] uppercase">WWW.JEEHUB.APP</p>
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
