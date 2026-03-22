import { Github, Code, Terminal, Zap, ExternalLink } from 'lucide-react';

export default function SourceCode() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#111] border border-white/5 rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                    <Github className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Source Code</h1>
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Open source core of Performance OS</p>
                </div>
            </div>

            <div className="p-12 bg-[#0b0f1a] border border-white/5 rounded-[3rem] space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                    <Terminal size={250} />
                </div>

                <div className="max-w-xl space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <Zap size={14} className="text-indigo-400 fill-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">Built with React 19 & Vite</span>
                    </div>
                    <h2 className="text-4xl font-bold ">Transparency is Edge.</h2>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                        The core of Trade Adhyayan is open for review. We believe in building in public and fostering a community of disciplined operators.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://github.com/ajayinvestorr/trade-adhyayan-v2"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-3 hover:bg-slate-200 transition-all hover:scale-105"
                        >
                            <Github size={20} />
                            View Repository
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-600 uppercase ">License</p>
                    <p className="font-bold">MIT Open Source</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-600 uppercase ">Framework</p>
                    <p className="font-bold">Next.js 15 (Edge)</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-600 uppercase ">Design</p>
                    <p className="font-bold">Tailwind v4.0</p>
                </div>
            </div>
        </div>
    );
}
