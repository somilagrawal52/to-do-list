# TaskFlow Pro ⚡

> **A high-performance, keyboard-first task management and focus studio built for modern engineering and productivity workflows.**

![React 19](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Vite 7](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Production-Ready-emerald?style=flat-square)

---

## 🌟 Market Differentiators & Standout Features

TaskFlow Pro bridges the gap between **Linear's keyboard velocity**, **Todoist's natural language speed**, and **Sunsama's deliberate daily focus** — without subscription paywalls, third-party tracking, or cloud lock-in.

### 1. 🧠 Smart Natural Language Input Engine (NLP)
* **Zero-friction typing**: Type tasks naturally with inline tokens and watch live entity chips auto-detect in real time:
  ```
  "Deploy v2.4 API tomorrow 4pm !urgent #engineering @3p ~deep"
  ```
* **Auto-detects**:
  * 📅 Dates (`today`, `tomorrow`, `friday`, `in 3 days`, `next week`)
  * ⏰ Times (`3pm`, `10:30am`, `18:00`)
  * 🔴 Priorities (`!urgent`, `!high`, `!med`, `!low`, `p1`-`p4`)
  * 📁 Categories (`#work`, `#personal`, `#engineering`, `#health`, `#finance`)
  * 🔥 Focus Blocks (`@2p`, `@3pomodoros`)
  * ⚡ Energy Levels (`~deep`, `~high`, `~quick`, `~low`)
* Automatically extracts and cleans the task title upon entry. 100% deterministic, private, and client-side.

---

### 2. 🎯 Eisenhower 2x2 Decision Matrix
* Break out of simple list dumping into an executive decision framework:
  * **🔴 Quadrant 1 — Do First** *(Urgent & Important)*: Immediate crises and critical deliverables.
  * **🔵 Quadrant 2 — Schedule** *(Important, Not Urgent)*: Deep work, learning, architecture, and fitness. The quadrant of long-term progress.
  * **🟡 Quadrant 3 — Delegate / Batch** *(Urgent, Not Important)*: Routine administrative chores and busywork.
  * **⚪ Quadrant 4 — Eliminate** *(Neither)*: Distractions and outdated items to prune.
* Drag-and-drop cards between quadrants to dynamically reprioritize your workload.

---

### 3. 🌙 End-of-Day Shutdown Ritual & Standup Exporter
* Inspired by Cal Newport’s "Shutdown Complete" routine:
  1. **Accomplishment Review**: Visual recap of finished tasks and logged focus minutes.
  2. **Unfinished Task Triage**: 1-click rollover of uncompleted tasks to tomorrow so you never carry guilt into your evening.
  3. **1-Click Daily Standup**: Instantly copy your formatted daily achievements to the clipboard for Slack, Discord, or team meetings.
  4. **Shutdown Complete**: Celebratory confetti and audio chime granting permission to disconnect.

---

### 4. 🎧 Continuous Ambient Focus Soundscapes
* Pure browser **Web Audio API** sound engine — zero external audio files, zero streaming bandwidth:
  * 🌊 **Brownian Noise**: Deep soothing acoustic masking designed for ADHD and programming focus.
  * 🌧️ **Soft Rain**: Organic pink noise rain simulation for relaxation.
  * 🧠 **10Hz Alpha Focus Wave**: Binaural stimulation for sustained cognitive stamina.

---

### 5. 🗂️ 5 Interactive Workspace Views
* **List View (`1`)**: Scoped views (All, Today, Upcoming, Important, Completed), flexible grouping (Date, Priority, Category), and floating batch actions.
* **Kanban Board (`2`)**: Pipeline columns (**To Do**, **In Progress**, **In Review**, **Done**) with drag-and-drop transitions.
* **Eisenhower Matrix (`3`)**: 2x2 Urgency vs Importance decision grid.
* **Monthly Calendar (`4`)**: Interactive matrix with priority density dots and scheduled day agenda.
* **Productivity Analytics (`5`)**: 7-day velocity chart, completion percentages, priority gauges, and category meters.

---

### 6. ⏱️ Integrated Pomodoro Focus Engine
* 25m Focus, 5m Short Break, and 15m Long Break intervals with circular animated countdown.
* Direct task linkage — automatically counts and stores completed focus blocks on the active task.

---

### 7. 🔒 100% Privacy & Data Portability
* **Zero Tracking / Zero Telemetry**: All data stays private in your browser's versioned `localStorage`.
* **Export Backup**: Download structured **JSON** backups or spreadsheet-ready **CSV** files.
* **Import Backup**: Upload JSON files with Merge or Replace options.
* **One-Click Demo Suite**: Pre-populated with realistic tasks, tags, and categories.

---

## ⌨️ Keyboard Shortcuts Reference

| Hotkey | Action |
| :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Open Spotlight Command Palette |
| `N` | Create a new task |
| `/` | Focus search bar / command hub |
| `1` | Switch to **List View** |
| `2` | Switch to **Kanban Board** |
| `3` | Switch to **Eisenhower Matrix** |
| `4` | Switch to **Calendar View** |
| `5` | Switch to **Analytics Dashboard** |
| `P` | Open / toggle **Pomodoro Focus Timer** |
| `A` | Toggle **Ambient Focus Soundscape** (Brown noise / Rain / Alpha) |
| `S` | Open **Daily Shutdown Ritual** |
| `D` | Toggle **Dark / Light Mode** |
| `?` | Open **Keyboard Shortcuts Cheat Sheet** |
| `Esc` | Close any active modal or menu |

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

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 📁 Project Architecture

```
to-do list/
├── public/
│   └── favicon.svg                    # Custom branded vector favicon
├── src/
│   ├── components/
│   │   ├── CommandPalette.jsx         # Ctrl+K spotlight search & commands
│   │   ├── DailyShutdownModal.jsx     # End-of-day closure & standup export
│   │   ├── ErrorBoundary.jsx          # Crash-prevention fallback UI
│   │   ├── ExportImportModal.jsx       # JSON/CSV backup and restore
│   │   ├── Header.jsx                 # Top brand bar, view switcher & hotkeys
│   │   ├── KeyboardShortcutsModal.jsx # Hotkeys reference modal
│   │   ├── PomodoroTimer.jsx          # 25/5/15m focus timer with ambient audio
│   │   ├── QuickAddTask.jsx           # Smart NLP inline task creator
│   │   ├── Sidebar.jsx                # Filter menu, energy scopes, categories & tags
│   │   ├── TaskAnalytics.jsx          # Productivity stats & 7-day velocity chart
│   │   ├── TaskCalendar.jsx           # Interactive monthly schedule & agenda
│   │   ├── TaskCard.jsx               # Modular card with energy badges & subtasks
│   │   ├── TaskDetailModal.jsx        # Full task creation & editor
│   │   ├── TaskEisenhowerMatrix.jsx   # 2x2 Urgency vs Importance decision grid
│   │   ├── TaskKanban.jsx             # Drag-and-drop status board
│   │   ├── TaskList.jsx               # Grouped list view with batch toolbar
│   │   └── Toast.jsx                  # Notifications with Undo action
│   ├── context/
│   │   ├── AudioContext.jsx           # Ambient audio & synthesized sound effects
│   │   ├── TaskContext.jsx            # State management, energy filters & actions
│   │   └── ThemeContext.jsx           # Dark / light theme management
│   ├── utils/
│   │   ├── dateUtils.js               # Relative date calculation helpers
│   │   ├── exportUtils.js             # JSON and CSV export/import parsers
│   │   ├── nlpParser.js               # Natural language task tokenizer
│   │   ├── sampleData.js              # Initial realistic demo data
│   │   ├── sound.js                   # Web Audio API tone & ambient noise engine
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

## 🛡️ License

Released under the [MIT License](LICENSE). Built for high-leverage focus, deliberate daily planning, and frictionless task execution.
