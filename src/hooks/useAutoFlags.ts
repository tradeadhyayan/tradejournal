import { useMemo } from 'react';
import { Trade } from '@/types';

export interface Flag {
    type: 'OVERTRADING' | 'RISK_VIOLATION' | 'REPEAT_LOSS' | 'DISCIPLINE_BREACH';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    value: string | number;
}

export function useAutoFlags(trades: Trade[], config = { maxTradesPerDay: 3, maxLossPerDay: 4000 }) {
    const flags = useMemo(() => {
        const foundFlags: Flag[] = [];
        const today = new Date().toDateString();
        const todayTrades = trades.filter(t => new Date(t.date).toDateString() === today);

        // 1. Overtrading
        if (todayTrades.length > config.maxTradesPerDay) {
            foundFlags.push({
                type: 'OVERTRADING',
                severity: todayTrades.length > config.maxTradesPerDay + 2 ? 'CRITICAL' : 'HIGH',
                message: `Overtrading detected: ${todayTrades.length} trades taken (Limit: ${config.maxTradesPerDay})`,
                value: todayTrades.length
            });
        }

        // 2. Risk Violation (Missing SL or Widened SL)
        const riskyTrades = todayTrades.filter(t => !t.stop_loss || (t.direction === 'LONG' && t.exit_price < t.stop_loss) || (t.direction === 'SHORT' && t.exit_price > t.stop_loss));
        if (riskyTrades.length > 0) {
            foundFlags.push({
                type: 'RISK_VIOLATION',
                severity: 'CRITICAL',
                message: `Risk Violation: ${riskyTrades.length} trades executed without hard SL or violation detected.`,
                value: riskyTrades.length
            });
        }

        // 3. Trading after Max Loss
        const totalPnl = todayTrades.reduce((acc, t) => acc + t.net_pnl, 0);
        if (totalPnl < -config.maxLossPerDay) {
            foundFlags.push({
                type: 'DISCIPLINE_BREACH',
                severity: 'CRITICAL',
                message: `Discipline Breach: Trading continued after hitting max daily loss limit (₹${config.maxLossPerDay}).`,
                value: formatCurrency(totalPnl)
            });
        }

        // 4. Repeat setup loss
        const setupGroups = todayTrades.reduce((acc: any, t) => {
            const sName = t.strategy || 'Uncategorized';
            acc[sName] = (acc[sName] || 0) + (t.net_pnl < 0 ? 1 : 0);
            return acc;
        }, {});

        Object.keys(setupGroups).forEach(id => {
            if (setupGroups[id] >= 3) {
                foundFlags.push({
                    type: 'REPEAT_LOSS',
                    severity: 'HIGH',
                    message: `Setup Warning: 3 consecutive losses on the same strategy. Stop and reflect.`,
                    value: setupGroups[id]
                });
            }
        });

        return foundFlags;
    }, [trades, config]);

    return flags;
}

function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}
