
export const RULE_BLUEPRINTS = [
    { text: "Max 2% Risk Per Trade", category: "RISK", priority: "P1" },
    { text: "Stop Loss Mandatory", category: "RISK", priority: "P1" },
    { text: "Daily Max Loss: 3%", category: "RISK", priority: "P1" },
    { text: "No Trading 15m Before News", category: "ENTRY", priority: "P2" },
    { text: "2-Step Entry Confirmation", category: "ENTRY", priority: "P2" },
    { text: "Exit on Trend Structure Break", category: "EXIT", priority: "P2" },
    { text: "Gratitude Journal Before Open", category: "PSYCHOLOGY", priority: "P3" },
    { text: "30m Break After Loss", category: "PSYCHOLOGY", priority: "P2" },
    { text: "No Revenge Trading", category: "PSYCHOLOGY", priority: "P1" },
    { text: "Close All Trades by 3:15 PM", category: "EXIT", priority: "P2" }
];

export const MISTAKE_BLUEPRINTS = [
    { title: "FOMO Entry", severity: "HIGH", description: "Entering late because the price moved without a signal." },
    { title: "Revenge Trading", severity: "CRITICAL", description: "Increasing size or frequency to recover losses." },
    { title: "Overtrading", severity: "MEDIUM", description: "Trading subpar setups due to boredom or lack of discipline." },
    { title: "Micro-managing SL", severity: "LOW", description: "Moving Stop Loss too tight before the trade has room to breathe." },
    { title: "Trading Against Trend", severity: "HIGH", description: "Trying to pick tops or bottoms in a strong trend." },
    { title: "Position Size Error", severity: "CRITICAL", description: "Entering with much more capital than the plan allows." }
];

export const STRATEGY_BLUEPRINTS = [
    {
        name: "Morning Star Reversal",
        description: "3-candle bullish reversal pattern at major support levels with volume confirmation.",
        status: "ACTIVE" as const,
        risk_per_trade: 1000,
        rules: []
    },
    {
        name: "Trend Pullback (20 EMA)",
        description: "Entry on the first or second touch of the 20 EMA during a confirmed trending environment.",
        status: "ACTIVE" as const,
        risk_per_trade: 1000,
        rules: []
    },
    {
        name: "ORB Breakout",
        description: "Opening Range Breakout (first 15/30 mins) with high relative volume.",
        status: "BACKTESTING" as const,
        risk_per_trade: 500,
        rules: []
    },
    {
        name: "VCP Consolidation",
        description: "Volatility Compression Pattern breakout from a tight base after a prior uptrend.",
        status: "ACTIVE" as const,
        risk_per_trade: 2000,
        rules: []
    }
];
