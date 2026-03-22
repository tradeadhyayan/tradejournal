# Trade Adhyayan v3: Design System & UI Manual

This document captures the visual identity, design tokens, and structural elements that define the **Professional Terminal** aesthetic of Trade Adhyayan.

## 🎨 Visual Identity & Philosophy
The design follows a "Professional Grade" approach, combining clean data visualization with high-tech elements like bento grids, glassmorphism, and soft drop shadows.

### Core Philosophy:
- **Zero Distraction**: High-contrast typography for readability.
- **Data First**: Use of Bento blocks to group related metrics.
- **Performance Feedback**: Immediate visual cues (Emerald/Rose) for P/L direction.

---

## 💎 Design Tokens

### Color Palette
| Token | HEX | Usage |
| :--- | :--- | :--- |
| **Primary** | `#4f46e5` | CTA Buttons, Active Nav, Icons |
| **Text (Primary)** | `#0f172a` | Headers, Main Body |
| **Text (Muted)** | `#64748b` | Sub-labels, Descriptions |
| **Success** | `#10b981` | Positive P/L, Winning Trades |
| **Danger** | `#f43f5e` | Negative P/L, Direct Errors |
| **Background** | `#f8fafc` | Main Application Surface |

### Typography
- **Headings**: `Quicksand`, `Outfit` (Tracking: -0.05em)
- **Body/UI**: `Plus Jakarta Sans`, `Inter`
- **Data/Labels**: `Inter` (Extra Bold / Black for KPIs)

### Shadows & Depth
- **Soft Shadow**: `0 10px 25px -5px rgba(0, 0, 0, 0.04)`
- **Glow Shadow**: `0 0 20px rgba(99, 102, 241, 0.08)`
- **Glassmorphism**: `backdrop-blur-md` with `bg-white/80`

---

## 🧩 Core UI Components

### 1. StatsCard (Bento Block)
The fundamental unit for metrics. Features an icon, a descriptive label, and a bold tracking-tight value.
- **Class**: `.p-8 .bg-white .rounded-[3rem] .shadow-2xl`
- **Hover**: `-translate-y-1 transition-all duration-500`

### 2. Branding (Logo)
A geometric representation of "Trade Adhyayan" with a focus on symmetry and modern finance.
- **Primary Color**: Indigo-600
- **Scale**: Multi-purpose (Hero: 1.25x, Header: 1x, Footer: 1.1x)

### 3. Professional Terminal
The data-entry nexus. Uses a sidebar + main canvas layout.
- **Sidebar**: High-contrast dark/light mode toggle.
- **Terminal Area**: Mono-spaced font support for pasting raw data.

---

## 🎬 Motion & Transitions
- **Onboarding**: `animate-in zoom-in duration-500`
- **Navigation**: `fade-in duration-700`
- **Interactions**: `hover:scale-105 active:scale-95`

---
*Created on 2026-01-27 to preserve the v3.0 Professional Interface.*
