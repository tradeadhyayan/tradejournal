// This file contains theme variable mappings for quick reference
// Use these CSS variables instead of hardcoded colors

export const themeVariables = {
    // Backgrounds
    appBg: 'var(--app-bg)',           // Main background
    appCard: 'var(--app-card)',       // Card backgrounds

    // Borders
    appBorder: 'var(--app-border)',   // Border colors

    // Text
    appText: 'var(--app-text)',       // Main text color
    appTextMuted: 'var(--app-text-muted)', // Muted text

    // Accent
    appAccent: 'var(--app-accent)',   // Accent color (indigo)
};

// Common class patterns for theme support
export const themeClasses = {
    card: 'bg-[var(--app-card)] border border-[var(--app-border)]',
    input: 'bg-[var(--app-bg)]/50 border border-[var(--app-border)] text-[var(--app-text)]',
    button: 'bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-accent)]/10',
    text: 'text-[var(--app-text)]',
    textMuted: 'text-[var(--app-text-muted)]',
};

// Replace patterns (for reference)
export const replacePatterns = {
    // Old dark theme patterns -> New theme-aware patterns
    'bg-[#0b0f1a]': 'bg-[var(--app-card)]',
    'bg-[#02040a]': 'bg-[var(--app-bg)]',
    'border-white/5': 'border-[var(--app-border)]',
    'border-white/10': 'border-[var(--app-border)]',
    'bg-white/5': 'bg-[var(--app-bg)]/50',
    'text-white': 'text-[var(--app-text)]',
    'text-slate-400': 'text-slate-500', // Keep for muted text
};
