import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Using your specific project credentials as the primary source
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kdrvqtptpymaoekiwirf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcnZxdHB0cHltYW9la2l3aXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDk4MDYsImV4cCI6MjA4NDY4NTgwNn0.JxLadWkV1W-i1sB63AhZfQ883Uz3GVTutPw8jImMWmo';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.error('❌ Supabase URL is missing or incorrect!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

