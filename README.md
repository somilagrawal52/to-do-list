# TaskFlow Pro ⚡

> **A high-performance, keyboard-first task management and focus studio built for modern engineering and productivity workflows.**

![React 19](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Vite 7](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Production-Ready-emerald?style=flat-square)

---

## 🌟 Key Highlights & Features

### 1. 🗂️ Versatile Workspace Views
* **Structured List View**: Filter by smart scopes (Today, Upcoming, High Priority, Completed) or group by Due Date, Priority, or Category. Inline quick-add bar with intelligent date and priority chips.
* **Interactive Kanban Board**: Visual progress pipeline across **To Do**, **In Progress**, **In Review**, and **Completed** with fluid drag-and-drop mechanics.
* **Monthly Agenda & Deadlines Calendar**: Interactive calendar matrix with priority density dots, day selection, and daily agenda inspection.
* **Productivity & Velocity Analytics**: 7-day completion velocity bar charts, priority distribution gauges, category completion rates, and streak counters.

### 2. ⏱️ Integrated Pomodoro Focus Engine
* Dedicated 25-minute focus session timer with 5-minute short breaks and 15-minute long breaks.
* Link any active task to the timer — automatically counts and persists completed focus blocks.
* Synthesized Web Audio alert chimes upon session completion (zero external asset dependencies).

### 3. ⌨️ Keyboard-First Command Hub
* **Spotlight Command Palette (`Ctrl + K` or `⌘ + K`)**: Instantly search tasks, navigate views, start timers, toggle themes, or run workspace commands.
* **Comprehensive Hotkeys**:
  * `N`: Create new task
  * `/`: Focus search / command palette
  * `1` - `4`: Switch views (List, Board, Calendar, Analytics)
  * `P`: Open / toggle Pomodoro timer
  * `D`: Toggle Dark / Light theme
  * `?`: View keyboard shortcuts cheat sheet
  * `Esc`: Close open drawers and modals

### 4. 🎨 Design, Accessibility & Audio Polish
* **Dynamic Dark & Light Mode**: Seamless system-aware theme switching with persistent user preference.
* **Synthesized Audio & Haptics**: Delightful sound effects generated via native Web Audio API oscillators for completions, clicks, and session alerts.
* **Celebration Effects**: Confetti explosion when all of today's tasks are completed.
* **Smart Undo System**: Immediate undo banner for deleted tasks with 5-second recovery window.

### 5. 🔒 100% Privacy & Data Portability
* **Zero Tracking / Zero Telemetry**: All data stays private in your browser's versioned `localStorage`.
* **Export Backup**: One-click download as structured JSON backup or CSV spreadsheet (compatible with Excel and Google Sheets).
* **Import Backup**: Upload JSON backup files with Merge or Replace options.
* **Sample Data Loader**: Pre-configured suite of realistic engineering and personal tasks for instant testing.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** `>= 18.0.0`
* **npm** `>= 9.0.0`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/to-do-list.git
cd to-do-list
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 📁 Project Architecture

```
to-do list/
├── public/
│   └── favicon.svg           # Custom branded SVG vector favicon
├── src/
│   ├── components/
│   │   ├── CommandPalette.jsx         # Ctrl+K spotlight search & commands
│   │   ├── ErrorBoundary.jsx          # Crash-prevention fallback UI
│   │   ├── ExportImportModal.jsx       # JSON/CSV backup and restore
│   │   ├── Header.jsx                 # Top brand bar, view switcher & hotkeys
│   │   ├── KeyboardShortcutsModal.jsx # Hotkeys reference modal
│   │   ├── PomodoroTimer.jsx          # 25/5/15m focus timer widget
│   │   ├── QuickAddTask.jsx           # Fast inline task creator
│   │   ├── Sidebar.jsx                # Filter menu, categories & tags
│   │   ├── TaskAnalytics.jsx          # Productivity stats & 7-day velocity chart
│   │   ├── TaskCalendar.jsx           # Interactive monthly schedule
│   │   ├── TaskCard.jsx               # Modular card with subtasks & badges
│   │   ├── TaskDetailModal.jsx        # Full task creation & editor
│   │   ├── TaskKanban.jsx             # Drag-and-drop status board
│   │   ├── TaskList.jsx               # Grouped list view with batch toolbar
│   │   └── Toast.jsx                  # Notifications with Undo action
│   ├── context/
│   │   ├── AudioContext.jsx           # Synthesized Web Audio API sound effects
│   │   ├── TaskContext.jsx            # State management, filters & batch actions
│   │   └── ThemeContext.jsx           # Dark / light theme management
│   ├── utils/
│   │   ├── dateUtils.js               # Relative date calculation helpers
│   │   ├── exportUtils.js             # JSON and CSV export/import parsers
│   │   ├── sampleData.js              # Initial realistic demo data
│   │   ├── sound.js                   # Pure Web Audio API tone generator
│   │   └── storage.js                 # Versioned localStorage wrapper
│   ├── App.css                        # Print styles and custom scrollbars
│   ├── App.jsx                        # Main application controller
│   ├── index.css                      # Tailwind CSS v4 directives
│   └── main.jsx                       # Application entrypoint
├── eslint.config.js                   # ESLint configuration
├── package.json                       # Dependencies and scripts
└── vite.config.js                     # Vite 7 build configuration
```

---

## 🚢 Production Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Framework preset: **Vite**.
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### Deploy to GitHub Pages
Add `base: './'` to `vite.config.js` and run:
```bash
npm run build
npx gh-pages -d dist
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Open Spotlight Command Palette |
| `N` | Create a new task |
| `/` | Focus search bar |
| `1` | Switch to List View |
| `2` | Switch to Kanban Board |
| `3` | Switch to Calendar View |
| `4` | Switch to Analytics Dashboard |
| `P` | Toggle Pomodoro Focus Timer |
| `D` | Toggle Dark / Light mode |
| `?` | Open Keyboard Shortcuts cheat sheet |
| `Esc` | Close any active modal or menu |

---

## 🛡️ License

Released under the [MIT License](LICENSE). Built for high-leverage focus and seamless task execution.
