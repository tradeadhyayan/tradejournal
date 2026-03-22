# Trade Adhyayan v3: Component Catalog

This catalog documents the key React components that form the building blocks of the **Professional Terminal** UI.

## 📦 Navigation & Layout

### `Logo`
- **Path**: `src/components/layout/Logo.tsx`
- **Purpose**: Brand identity.
- **Props**:
  - `iconOnly?`: boolean (renders just the geometric icon).
  - `className?`: string (utility overrides).

### `PublicHeader`
- **Path**: `src/components/layout/PublicHeader.tsx`
- **Purpose**: Top navigation for the landing page.
- **Features**: Glassmorphism scroll-effect, sticky positioning.

### `Sidebar`
- **Path**: `src/components/layout/Sidebar.tsx`
- **Purpose**: Navigation for the Dashboard area.
- **Style**: High-contrast, vertically stacked, featuring "Professional" active states.

---

## 📊 Performance & Analytics

### `StatsCard`
- **Path**: `src/components/features/StatsCard.tsx`
- **Purpose**: Displays a single trading metric (e.g. Win Rate).
- **Props**:
  - `title`: string (e.g., "PROFIT FACTOR").
  - `value`: string/number (e.g., "2.45x").
  - `icon`: Lucide icon component.
  - `trend?`: string (percentage growth).
  - `trendUp?`: boolean (Emerald vs Rose indicator).

### `EquityChart`
- **Path**: `src/components/features/EquityChart.tsx`
- **Purpose**: Visualizes the growth of capital over time.
- **Library**: Recharts (ResponsiveContainer).
- **Gradients**: Uses a soft Indigo gradient fill for the area chart.

---

## 🏗️ Utility Components

### `InputWrapper`
- **Path**: Defined inline in `Login.tsx` and `TradeForm.tsx`.
- **Purpose**: Provides a consistent icon-prefixed container for all form inputs.
- **Style**: Subtle borders, focus-within indigo highlights.

### `BentoBox` (Pattern)
- **Style**: `.grid-cols-2 .lg:grid-cols-4 .gap-6`.
- **Logic**: Used to organzie disparate metrics into a cohesive "Command Center" view.

---
*Created on 2026-01-27 to ensure component reuse and design consistency.*
