import type { Trade } from '@/types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/stats';

interface EquityChartProps {
    trades: Trade[];
    initialCapital?: number;
}

export function EquityChart({ trades, initialCapital = 0 }: EquityChartProps) {
    // Sort trades by date ascending
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate cumulative PnL starting from initial capital
    let cumulative = initialCapital;
    const data = sortedTrades.map((t) => {
        cumulative += t.net_pnl;
        return {
            date: new Date(t.date).toLocaleDateString(),
            equity: cumulative,
            originalDate: t.date
        };
    });

    if (data.length === 0) {
        return <div className="flex h-[300px] items-center justify-center text-slate-500">No trades recorded yet</div>;
    }

    return (
        <div className="h-[350px] w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Equity Curve</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        stroke="#cbd5e1"
                        fontSize={10}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#cbd5e1"
                        fontSize={10}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', color: '#334155', borderRadius: '1.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                        formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Equity']}
                    />
                    <Area
                        type="monotone"
                        dataKey="equity"
                        stroke="#818cf8"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorEquity)"
                        strokeLinecap="round"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
