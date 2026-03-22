import { Trade } from '@/types';
import { getRealQuantity } from '@/lib/stats';
import { supabase } from '@/lib/supabase';

export interface NormalizedTrade {
    date: string;
    instrument: string;
    direction: 'LONG' | 'SHORT';
    entry_price: number;
    exit_price: number;
    quantity: number;
    stop_loss: number;
    asset_class: 'INDEX' | 'STOCKS' | 'OPTIONS' | 'COMMODITY' | 'CURRENCY';
    strategy: string;
    gross_pnl: number;
    net_pnl: number;
}

export abstract class BrokerProvider {
    abstract name: string;
    abstract fetchTrades(encryptedToken: string): Promise<any[]>;
    abstract normalize(rawTrades: any[]): NormalizedTrade[];

    /**
     * Deduplication logic: Check if a trade already exists.
     * SOP Rule 2: Duplicate protection.
     */
    protected isDuplicate(newTrade: NormalizedTrade, existingTrades: Trade[]): boolean {
        return existingTrades.some(t =>
            t.instrument === newTrade.instrument &&
            Math.abs(new Date(t.date).getTime() - new Date(newTrade.date).getTime()) < 60000 && // Within 1 minute
            t.quantity === newTrade.quantity &&
            t.direction === newTrade.direction
        );
    }

    async syncTrades(encryptedToken: string, existingTrades: Trade[]): Promise<NormalizedTrade[]> {
        const raw = await this.fetchTrades(encryptedToken);
        const normalized = this.normalize(raw);
        return normalized.filter(t => !this.isDuplicate(t, existingTrades));
    }
}

/**
 * Dhan Implementation
 * Step 4: Map broker fields -> normalized schema
 */
/* export class DhanProvider extends BrokerProvider {
    name = 'Dhan';

    async fetchTrades(encryptedToken: string): Promise<any[]> {
        const { data, error } = await supabase.functions.invoke('broker-sync', {
            body: {
                broker: 'Dhan',
                encrypted_token: encryptedToken
            }
        });

        if (error) throw error;
        return data || [];
    }

    normalize(rawTrades: any[]): NormalizedTrade[] {
        return rawTrades.map(trade => {
            const entry = parseFloat(trade.avgPrice || '0');
            const exit = parseFloat(trade.sellPrice || '0'); // Logic depends on trade side
            const pnl = trade.pnl || 0;

            return {
                date: trade.createTime || new Date().toISOString(),
                instrument: trade.tradingSymbol || 'UNKNOWN',
                direction: trade.transactionType === 'SELL' ? 'SHORT' : 'LONG',
                entry_price: entry,
                exit_price: exit,
                quantity: trade.quantity || 0,
                stop_loss: 0,
                asset_class: 'STOCKS', // Default mapping
                strategy: 'AUTO_SYNC',
                gross_pnl: pnl,
                net_pnl: pnl
            };
        });
    }
} */

/**
 * Zerodha Implementation
 */
export class ZerodhaProvider extends BrokerProvider {
    name = 'Zerodha';

    async fetchTrades(encryptedToken: string): Promise<any[]> {
        return [];
    }

    normalize(rawTrades: any[]): NormalizedTrade[] {
        return [];
    }
}

/* export const BROKER_PROVIDERS: Record<string, BrokerProvider> = {
    'Dhan': new DhanProvider(),
    'Zerodha': new ZerodhaProvider()
}; */
export const BROKER_PROVIDERS: Record<string, any> = {};
