import { useState, useEffect, useRef } from 'react'
import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'
import {
  Search,
  CheckCircle,
  Plus,
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
  Download,
  HelpCircle,
  CornerDownLeft,
  MoonStar,
  Headphones
} from 'lucide-react'

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenShortcuts,
  onOpenBackup,
  onOpenShutdown
}) {
  const {
    tasks,
    setActiveView,
    setModalTask,
    setIsPomodoroOpen
  } = useTasks()
  const { toggleTheme, isDark } = useTheme()
  const { soundEnabled, toggleSound, toggleAmbient } = useAudio()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build commands
  const navigationCommands = [
    {
      id: 'cmd-new',
      title: 'Create New Task',
      subtitle: 'Add a new item to your workspace',
      icon: Plus,
      action: () => {
        setModalTask('new')
        onClose()
      }
    },
    {
      id: 'cmd-list',
      title: 'Switch to List View',
      subtitle: 'Structured list of all tasks with filters',
      icon: LayoutList,
      action: () => {
        setActiveView('list')
        onClose()
      }
    },
    {
      id: 'cmd-board',
      title: 'Switch to Kanban Board',
      subtitle: 'Card pipeline across progress stages',
      icon: Kanban,
      action: () => {
        setActiveView('board')
        onClose()
      }
    },
    {
      id: 'cmd-matrix',
      title: 'Switch to Eisenhower Matrix View',
      subtitle: '2x2 Urgency vs Importance decision grid',
      icon: Grid2X2,
      action: () => {
        setActiveView('matrix')
        onClose()
      }
    },
    {
      id: 'cmd-calendar',
      title: 'Switch to Calendar View',
      subtitle: 'Monthly visual schedule & deadlines',
      icon: Calendar,
      action: () => {
        setActiveView('calendar')
        onClose()
      }
    },
    {
      id: 'cmd-analytics',
      title: 'View Productivity Analytics',
      subtitle: 'Streaks, velocity, and completion rates',
      icon: BarChart2,
      action: () => {
        setActiveView('analytics')
        onClose()
      }
    },
    {
      id: 'cmd-shutdown',
      title: 'Daily Shutdown Ritual',
      subtitle: 'Close open loops, roll over tasks, and disconnect',
      icon: MoonStar,
      action: () => {
        onOpenShutdown()
        onClose()
      }
    },
    {
      id: 'cmd-ambient-brown',
      title: 'Toggle Brown Noise (Deep Focus)',
      subtitle: 'Continuous acoustic focus soundscape',
      icon: Headphones,
      action: () => {
        toggleAmbient('brown')
        onClose()
      }
    },
    {
      id: 'cmd-ambient-rain',
      title: 'Toggle Soft Rain Soundscape',
      subtitle: 'Gentle rain background sound',
      icon: Headphones,
      action: () => {
        toggleAmbient('rain')
        onClose()
      }
    },
    {
      id: 'cmd-pomodoro',
      title: 'Toggle Pomodoro Timer',
      subtitle: '25-minute focus session with interval breaks',
      icon: Flame,
      action: () => {
        setIsPomodoroOpen(true)
        onClose()
      }
    },
    {
      id: 'cmd-theme',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle theme preference',
      icon: isDark ? Sun : Moon,
      action: () => {
        toggleTheme()
        onClose()
      }
    },
    {
      id: 'cmd-audio',
      title: soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects',
      subtitle: 'Toggle synthesized audio feedback',
      icon: soundEnabled ? VolumeX : Volume2,
      action: () => {
        toggleSound()
        onClose()
      }
    },
    {
      id: 'cmd-backup',
      title: 'Backup & Restore (JSON / CSV)',
      subtitle: 'Export data or load backups',
      icon: Download,
      action: () => {
        onOpenBackup()
        onClose()
      }
    },
    {
      id: 'cmd-help',
      title: 'Keyboard Shortcuts Guide',
      subtitle: 'View full cheat sheet of hotkeys',
      icon: HelpCircle,
      action: () => {
        onOpenShortcuts()
        onClose()
      }
    }
  ]

  // Filter items based on query
  const matchingTasks = query.trim()
    ? tasks
        .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          title: t.title,
          subtitle: `${t.status} • Priority: ${t.priority}`,
          icon: CheckCircle,
          action: () => {
            setModalTask(t)
            onClose()
          }
        }))
    : []

  const matchingCommands = query.trim()
    ? navigationCommands.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : navigationCommands

  const allItems = [...matchingTasks, ...matchingCommands]

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search tasks, or run daily shutdown..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden text-base"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No matching commands or tasks found
            </div>
          ) : (
            allItems.map((item, index) => {
              const Icon = item.icon
              const isSelected = index === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
          <span>TaskFlow Command Hub</span>
        </div>
      </div>
    </div>
  )
}
