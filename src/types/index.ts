export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    phone_number?: string;
    plan: 'FREE' | 'PRO' | 'MENTOR';
    subscription_status?: string;
    current_period_end?: string;
    total_qp?: number;
    initial_capital?: number;
    avatar_url?: string;
    experience?: string;
    referral_source?: string;
    role: 'USER' | 'ADMIN';
    daily_streak?: number;
    last_rules_completed_at?: string;
    created_at: string;
}

export type AssetClass = 'INDEX' | 'STOCKS' | 'COMMODITIES' | 'FUTURES' | 'CRYPTO';

export interface StrategyRule {
    id: string;
    text: string;
    type: 'ENTRY' | 'EXIT' | 'RISK';
}

export interface Strategy {
    id: string;
    user_id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'BACKTESTING' | 'ARCHIVED';
    risk_per_trade: number;
    created_at: string;
    rules?: StrategyRule[];
}

export interface Mistake {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    created_at: string;
}

export interface Rule {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    is_daily: boolean;
    category?: string;
    priority?: string;
    created_at: string;
}

export interface Trade {
    id: string;
    user_id: string;
    date: string;
    instrument: string;
    asset_class: string | null;
    direction: string;
    entry_price: number;
    exit_price: number;
    quantity: number;
    fees: number;
    stop_loss: number | null;
    emotion: string | null;
    strategy: string | null;
    gross_pnl: number;
    net_pnl: number;
    tags: string[] | null;
    notes: string | null;
    import_id: string | null;
    mistake_ids: string[] | null;
    created_at: string;
}

export interface TradeImport {
    id: string;
    user_id: string;
    filename: string;
    total_count: number;
    success_count: number;
    fail_count: number;
    created_at: string;
}

export interface TradingEvent {
    id: string;
    user_id: string;
    date: string;
    title: string;
    description: string | null;
    type: 'ECONOMIC' | 'NOTE' | 'MILESTONE';
    created_at: string;
}

export interface TradeStats {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    bestTrade: number;
    worstTrade: number;
    totalProfit: number;
    totalLoss: number;
    netPnl: number;
    avgPnlPerTrade: number;
    avgRR: number;
    totalInvested: number;
    maxDrawdown: number;
    expectancy: number;
    recoveryFactor: number;
    avgRiskReward: number;
}
