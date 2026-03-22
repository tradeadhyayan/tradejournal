import { TradeForm } from '@/components/features/TradeForm';
import { useNavigate } from 'react-router-dom';

export default function LogTradePage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl font-bold mb-4">Manual Execution</h1>
                <p className="text-slate-400 max-w-sm mx-auto">Precision journaling starts with honest recording. Log your trade details below.</p>
            </div>

            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <TradeForm onClose={() => navigate('/journal')} />
            </div>
        </div>
    );
}
