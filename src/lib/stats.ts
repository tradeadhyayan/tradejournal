import type { Trade, TradeStats } from '@/types';

/**
 * Calculates trading statistics with support for Lot Sizes and dynamic Capital tracking.
 */
export function calculateStats(trades: Trade[], masterCapital: number = 0): TradeStats {
    const baseStats = {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        profitFactor: 0,
        avgWin: 0,
        avgLoss: 0,
        bestTrade: 0,
        worstTrade: 0,
        totalProfit: 0,
        totalLoss: 0,
        netPnl: 0,
        avgPnlPerTrade: 0,
        avgRR: 0,
        totalInvested: masterCapital,
        maxDrawdown: 0,
        expectancy: 0,
        recoveryFactor: 0,
        avgRiskReward: 0
    };

    if (!trades.length) return baseStats;

    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalTrades = trades.length;
    const wins = trades.filter((t) => t.net_pnl > 0);
    const losses = trades.filter((t) => t.net_pnl <= 0);

    const winningTrades = wins.length;
    const losingTrades = losses.length;
    const winRate = (winningTrades / totalTrades) * 100;

    const totalProfit = wins.reduce((acc, t) => acc + t.net_pnl, 0);
    const totalLoss = Math.abs(losses.reduce((acc, t) => acc + t.net_pnl, 0));
    const netPnl = totalProfit - totalLoss;

    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
    const avgWin = winningTrades ? totalProfit / winningTrades : 0;
    const avgLoss = losingTrades ? totalLoss / losingTrades : 0;

    const expectancy = (winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss);

    const avgPnlPerTrade = netPnl / totalTrades;
    const bestTrade = Math.max(...trades.map((t) => t.net_pnl));
    const worstTrade = Math.min(...trades.map((t) => t.net_pnl));

    // Calculate Max Drawdown
    let peak = masterCapital;
    let currentBalance = masterCapital;
    let maxDD = 0;

    sortedTrades.forEach(t => {
        currentBalance += t.net_pnl;
        if (currentBalance > peak) peak = currentBalance;
        const drawdown = peak - currentBalance;
        if (drawdown > maxDD) maxDD = drawdown;
    });

    const recoveryFactor = maxDD === 0 ? profitFactor : netPnl / maxDD;

    const rMultiples = trades.map(t => {
        if (!t.stop_loss || t.stop_loss === t.entry_price) return 0;
        const risk = t.direction === 'LONG' ? Math.abs(t.entry_price - t.stop_loss) : Math.abs(t.stop_loss - t.entry_price);
        const reward = t.direction === 'LONG' ? (t.exit_price - t.entry_price) : (t.entry_price - t.exit_price);
        return reward / risk;
    }).filter(r => !isNaN(r) && isFinite(r));

    const avgRR = rMultiples.length > 0 ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length : 0;

    return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        profitFactor,
        avgWin,
        avgLoss,
        bestTrade,
        worstTrade,
        totalProfit,
        totalLoss,
        netPnl,
        avgPnlPerTrade,
        avgRR,
        totalInvested: masterCapital + netPnl,
        maxDrawdown: maxDD,
        expectancy,
        recoveryFactor,
        avgRiskReward: avgRR
    };
}

/**
 * Utility to calculate real quantity based on Lot Sizes for Indian Indices
 */
export function getRealQuantity(symbol: string, quantity: number): number {
    const sym = symbol.toUpperCase();

    // Mapping of common Indian indices to their current lot sizes
    const lotSizes: Record<string, number> = {
        'NIFTY': 25,
        'BANKNIFTY': 15,
        'FINNIFTY': 25,
        'SENSEX': 10,
        'MIDCAPNIFTY': 50,
        'BANKEX': 15,
    };

    for (const [index, size] of Object.entries(lotSizes)) {
        if (sym.includes(index)) {
            // If quantity < 100, we assume it's number of lots (except for stocks)
            // If quantity >= 100, we assume it's total shares
            if (quantity < 100) return quantity * size;
            return quantity;
        }
    }

    return quantity;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
