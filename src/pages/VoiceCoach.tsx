import { Mic, Zap, Sparkles, Play, Headphones, MessageSquare, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useState } from 'react';

export default function VoiceCoach() {
    const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecorder();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAction = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    const handleAnalyze = async () => {
        if (!audioBlob) return;
        setIsAnalyzing(true);
        // Simulation of Gemini AI analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            alert("Mindset Analysis Complete: You sounded composed but slightly hesistant on the entry. Focus on your pre-defined triggers.");
        }, 3000);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] transform -rotate-3 hover:rotate-0 transition-transform">
                    <Headphones className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight font-heading">Voice Coach</h1>
                    <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase">AI Mindset Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-12 bg-gradient-to-br from-indigo-600/10 to-[var(--app-card)] border border-[var(--app-border)] rounded-[4rem] flex flex-col items-center justify-center text-center space-y-10 min-h-[500px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Sparkles size={250} />
                    </div>

                    <div className="w-28 h-28 bg-[var(--app-card)] border border-[var(--app-border)] rounded-full flex items-center justify-center relative shadow-2xl">
                        {isRecording && <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />}
                        <Mic size={40} className={cn("relative z-10 transition-colors", isRecording ? "text-rose-500" : "text-indigo-400")} />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h2 className="text-3xl font-bold font-heading">
                            {isRecording ? "Listening to Your Edge..." : "De-brief Your Trade"}
                        </h2>
                        <p className="text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
                            {isRecording
                                ? "Take your time. Explain the why behind your entry and any emotions you felt."
                                : "Narrate your thoughts, feelings, and the trade context. Let AI analyze your psychological subtext."
                            }
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
                        <button
                            onClick={handleAction}
                            className={cn(
                                "w-full py-6 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4",
                                isRecording ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"
                            )}
                        >
                            {isRecording ? <Square size={18} className="fill-white" /> : <Play size={18} className="fill-white" />}
                            {isRecording ? "Stop Recording" : audioBlob ? "Record Again" : "Initiate Session"}
                        </button>

                        {audioBlob && !isRecording && (
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full py-6 bg-emerald-500 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {isAnalyzing ? "Analyzing Subtext..." : "Analyze Mindset"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[4rem] space-y-10 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold font-heading text-[var(--app-text)]">Recent Audit</h3>
                        <div className="px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-sm">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase">Premium Only</span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <DebriefItem
                            date="Jan 24, 2026"
                            mood="Zen Mode"
                            insight="Detected high emotional stability during the RELIANCE reversal. Patience was your edge today."
                        />
                        <DebriefItem
                            date="Jan 23, 2026"
                            mood="Anxious"
                            insight="Narrative suggests FOMO during the morning NIFTY breakout. Volume was ignored in your description."
                        />

                        <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] text-center shadow-inner">
                            <MessageSquare className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                            <p className="text-xs font-bold text-[var(--app-text-muted)] leading-relaxed uppercase">
                                Journaling your voice is the fastest way to master trading psychology.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DebriefItem({ date, mood, insight }: any) {
    return (
        <div className="p-8 bg-[var(--app-bg)]/40 border border-[var(--app-border)] rounded-[2.5rem] flex flex-col gap-4 group cursor-pointer hover:bg-indigo-500/5 transition-all shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-[var(--app-text-muted)] tracking-[0.4em] uppercase">{date}</p>
                <div className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold uppercase",
                    mood === 'Zen Mode' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                )}>
                    {mood}
                </div>
            </div>
            <p className="text-sm font-bold text-[var(--app-text-muted)] group-hover:text-[var(--app-text)] leading-relaxed italic transition-colors">"{insight}"</p>
        </div>
    );
}
