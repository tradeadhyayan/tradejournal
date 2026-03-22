export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            broker_links: {
                Row: {
                    api_key: string | null
                    broker_name: string
                    id: string
                    last_sync: string | null
                    status: string | null
                    user_id: string | null
                }
                Insert: {
                    api_key?: string | null
                    broker_name: string
                    id?: string
                    last_sync?: string | null
                    status?: string | null
                    user_id?: string | null
                }
                Update: {
                    api_key?: string | null
                    broker_name?: string
                    id?: string
                    last_sync?: string | null
                    status?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "broker_links_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            challenges: {
                Row: {
                    created_at: string | null
                    current_value: number | null
                    id: string
                    reward_qp: number | null
                    status: string | null
                    target_value: number
                    title: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    current_value?: number | null
                    id?: string
                    reward_qp?: number | null
                    status?: string | null
                    target_value: number
                    title: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    current_value?: number | null
                    id?: string
                    reward_qp?: number | null
                    status?: string | null
                    target_value?: number
                    title?: string
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "challenges_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trading_events: {
                Row: {
                    id: string
                    user_id: string | null
                    date: string
                    title: string
                    description: string | null
                    type: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    date: string
                    title: string
                    description?: string | null
                    type?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    date?: string
                    title?: string
                    description?: string | null
                    type?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trading_events_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            mistakes: {
                Row: {
                    id: string
                    user_id: string | null
                    title: string
                    description: string | null
                    severity: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    title: string
                    description?: string | null
                    severity?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    title?: string
                    description?: string | null
                    severity?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "mistakes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            partner_inquiries: {
                Row: {
                    created_at: string | null
                    email: string
                    id: string
                    message: string | null
                    name: string
                    phone: string | null
                    status: string | null
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    id?: string
                    message?: string | null
                    name: string
                    phone?: string | null
                    status?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    id?: string
                    message?: string | null
                    name?: string
                    phone?: string | null
                    status?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    daily_streak: number | null
                    email: string | null
                    full_name: string | null
                    id: string
                    last_activity_date: string | null
                    phone_number: string | null
                    plan: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    daily_streak?: number | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    last_activity_date?: string | null
                    phone_number?: string | null
                    plan?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    daily_streak?: number | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    last_activity_date?: string | null
                    phone_number?: string | null
                    plan?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            roadmap_progress: {
                Row: {
                    completed_at: string | null
                    id: string
                    is_completed: boolean | null
                    step_id: string
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    step_id: string
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    step_id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "roadmap_progress_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            rules: {
                Row: {
                    completed: boolean | null
                    created_at: string | null
                    id: string
                    text: string
                    user_id: string | null
                    category: string | null
                    priority: string | null
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string | null
                    id?: string
                    text: string
                    user_id?: string | null
                    category?: string | null
                    priority?: string | null
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string | null
                    id?: string
                    text?: string
                    user_id?: string | null
                    category?: string | null
                    priority?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "rules_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            strategies: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    user_id: string | null
                    status: string | null
                    risk_per_trade: number | null
                    rules: Json | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    user_id?: string | null
                    status?: string | null
                    risk_per_trade?: number | null
                    rules?: Json | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    user_id?: string | null
                    status?: string | null
                    risk_per_trade?: number | null
                    rules?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "strategies_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trade_imports: {
                Row: {
                    created_at: string
                    fail_count: number | null
                    filename: string | null
                    id: string
                    success_count: number | null
                    total_count: number | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    fail_count?: number | null
                    filename?: string | null
                    id?: string
                    success_count?: number | null
                    total_count?: number | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    fail_count?: number | null
                    filename?: string | null
                    id?: string
                    success_count?: number | null
                    total_count?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trade_imports_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trades: {
                Row: {
                    asset_class: string | null
                    created_at: string
                    date: string
                    direction: string
                    emotion: string | null
                    entry_price: number
                    exit_price: number
                    fees: number
                    gross_pnl: number
                    id: string
                    import_id: string | null
                    instrument: string
                    net_pnl: number
                    notes: string | null
                    quantity: number
                    stop_loss: number | null
                    strategy: string | null
                    tags: string[] | null
                    user_id: string
                    mistake_ids: string[] | null
                }
                Insert: {
                    asset_class?: string | null
                    created_at?: string
                    date: string
                    direction: string
                    emotion?: string | null
                    entry_price: number
                    exit_price: number
                    fees: number
                    gross_pnl: number
                    id?: string
                    import_id?: string | null
                    instrument: string
                    net_pnl: number
                    notes?: string | null
                    quantity: number
                    stop_loss?: number | null
                    strategy?: string | null
                    tags?: string[] | null
                    user_id: string
                    mistake_ids?: string[] | null
                }
                Update: {
                    asset_class?: string | null
                    created_at?: string
                    date?: string
                    direction?: string
                    emotion?: string | null
                    entry_price?: number
                    exit_price?: number
                    fees?: number
                    gross_pnl?: number
                    id?: string
                    import_id?: string | null
                    instrument?: string
                    net_pnl?: number
                    notes?: string | null
                    quantity?: number
                    stop_loss?: number | null
                    strategy?: string | null
                    tags?: string[] | null
                    user_id?: string
                    mistake_ids?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trades_import_id_fkey"
                        columns: ["import_id"]
                        isOneToOne: false
                        referencedRelation: "trade_imports"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "trades_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_challenges: {
                Row: {
                    completed_at: string | null
                    current_value: number | null
                    id: string
                    progress_percent: number | null
                    status: string | null
                    type: string
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    current_value?: number | null
                    id?: string
                    progress_percent?: number | null
                    status?: string | null
                    type: string
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    current_value?: number | null
                    id?: string
                    progress_percent?: number | null
                    status?: string | null
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_challenges_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_daily_tasks: {
                Row: {
                    created_at: string
                    id: string
                    is_completed: boolean | null
                    task_date: string | null
                    task_name: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_completed?: boolean | null
                    task_date?: string | null
                    task_name: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_completed?: boolean | null
                    task_date?: string | null
                    task_name?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_daily_tasks_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    current_period_end: string | null
                    email: string
                    full_name: string | null
                    id: string
                    initial_capital: number | null
                    phone_number: string | null
                    plan: string | null
                    role: string | null
                    subscription_status: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    current_period_end?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    initial_capital?: number | null
                    phone_number?: string | null
                    plan?: string | null
                    role?: string | null
                    subscription_status?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    current_period_end?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    initial_capital?: number | null
                    phone_number?: string | null
                    plan?: string | null
                    role?: string | null
                    subscription_status?: string | null
                }
                Relationships: []
            }
            webinar_registrations: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    whatsapp: string
                    webinar_date: string
                    email: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    whatsapp: string
                    webinar_date: string
                    email?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    whatsapp?: string
                    webinar_date?: string
                    email?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
