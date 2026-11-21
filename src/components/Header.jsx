import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'
import {
  CheckSquare,
  Search,
  LayoutList,
  Kanban,
  Grid2X2,
  Calendar,
  BarChart2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Flame,
  Plus,
  HelpCircle,
  Database,
  Menu,
  Command,
  MoonStar,
  Headphones
} from 'lucide-react'

export default function Header({
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenBackup,
  onOpenShutdown
}) {
  const {
    activeView,
    setActiveView,
    setModalTask,
    setIsPomodoroOpen,
    pomodoroTask
  } = useTasks()

  const { isDark, toggleTheme } = useTheme()
  const { soundEnabled, toggleSound, activeAmbient, toggleAmbient } = useAudio()

  const views = [
    { id: 'list', label: 'List', icon: LayoutList, shortcut: '1' },
    { id: 'board', label: 'Board', icon: Kanban, shortcut: '2' },
    { id: 'matrix', label: 'Matrix', icon: Grid2X2, shortcut: '3' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, shortcut: '4' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, shortcut: '5' }
  ]

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  TaskFlow
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Pro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search & Command Palette Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            onClick={onOpenCommandPalette}
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 text-xs font-medium cursor-pointer transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search tasks, natural language, shortcuts...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>

        {/* Right: View Switchers & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher Pills */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {views.map((v) => {
              const Icon = v.icon
              const isActive = activeView === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveView(v.id)}
                  title={`${v.label} View (Press ${v.shortcut})`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              )
            })}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

          {/* Ambient Soundscape Quick Toggle */}
          <button
            type="button"
            onClick={() => toggleAmbient(activeAmbient ? activeAmbient : 'brown')}
            title={activeAmbient ? `Playing ${activeAmbient} noise (Click to mute)` : 'Toggle Ambient Focus Sound'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeAmbient
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Headphones className={`w-4 h-4 ${activeAmbient ? 'animate-pulse' : ''}`} />
          </button>

          {/* Pomodoro Focus Launcher */}
          <button
            type="button"
            onClick={() => setIsPomodoroOpen(true)}
            title="Pomodoro Focus Timer (Press P)"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              pomodoroTask
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 ring-2 ring-amber-500/20'
                : 'text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
          </button>

          {/* Daily Shutdown Ritual Button */}
          <button
            type="button"
            onClick={onOpenShutdown}
            title="Daily Shutdown Ritual"
            className="p-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors cursor-pointer"
          >
            <MoonStar className="w-4 h-4" />
          </button>

          {/* Audio Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Backup / Export / Import */}
          <button
            type="button"
            onClick={onOpenBackup}
            title="Backup & Restore Data (JSON / CSV)"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Shortcuts Help */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Primary New Task CTA */}
          <button
            type="button"
            onClick={() => setModalTask('new')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Mobile View Switcher Bar */}
      <div className="flex sm:hidden items-center justify-around mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {views.map((v) => {
          const Icon = v.icon
          const isActive = activeView === v.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{v.label}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
