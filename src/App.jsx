import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { AudioProvider, useAudio } from './context/AudioContext'
import { TaskProvider, useTasks } from './context/TaskContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import QuickAddTask from './components/QuickAddTask'
import TaskList from './components/TaskList'
import TaskKanban from './components/TaskKanban'
import TaskEisenhowerMatrix from './components/TaskEisenhowerMatrix'
import TaskCalendar from './components/TaskCalendar'
import TaskAnalytics from './components/TaskAnalytics'
import TaskDetailModal from './components/TaskDetailModal'
import PomodoroTimer from './components/PomodoroTimer'
import CommandPalette from './components/CommandPalette'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal'
import ExportImportModal from './components/ExportImportModal'
import DailyShutdownModal from './components/DailyShutdownModal'
import Toast from './components/Toast'

function MainLayout() {
  const { activeView, setActiveView, setModalTask, setIsPomodoroOpen } = useTasks()
  const { toggleTheme } = useTheme()
  const { activeAmbient, toggleAmbient } = useAudio()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isBackupOpen, setIsBackupOpen] = useState(false)
  const [isShutdownOpen, setIsShutdownOpen] = useState(false)

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase()
      const isInput = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable

      // Cmd+K or Ctrl+K opens Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
        return
      }

      // Escape closes open modals
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
        setIsShortcutsOpen(false)
        setIsBackupOpen(false)
        setIsShutdownOpen(false)
        return
      }

      // Don't trigger letter hotkeys when user is actively typing in a form input
      if (isInput) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setModalTask('new')
      } else if (e.key === '1') {
        e.preventDefault()
        setActiveView('list')
      } else if (e.key === '2') {
        e.preventDefault()
        setActiveView('board')
      } else if (e.key === '3') {
        e.preventDefault()
        setActiveView('matrix')
      } else if (e.key === '4') {
        e.preventDefault()
        setActiveView('calendar')
      } else if (e.key === '5') {
        e.preventDefault()
        setActiveView('analytics')
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setIsPomodoroOpen((prev) => !prev)
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        toggleAmbient(activeAmbient ? activeAmbient : 'brown')
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setIsShutdownOpen(true)
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        toggleTheme()
      } else if (e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen(true)
      } else if (e.key === '/') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveView, setModalTask, setIsPomodoroOpen, toggleTheme, toggleAmbient, activeAmbient])

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenShutdown={() => setIsShutdownOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-6xl">
          {activeView === 'list' && (
            <div className="space-y-6">
              <QuickAddTask />
              <TaskList />
            </div>
          )}

          {activeView === 'board' && <TaskKanban />}

          {activeView === 'matrix' && <TaskEisenhowerMatrix />}

          {activeView === 'calendar' && <TaskCalendar />}

          {activeView === 'analytics' && <TaskAnalytics />}
        </main>
      </div>

      {/* Modals & Portals */}
      <TaskDetailModal />
      <PomodoroTimer />
      <DailyShutdownModal
        isOpen={isShutdownOpen}
        onClose={() => setIsShutdownOpen(false)}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenShutdown={() => setIsShutdownOpen(true)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <ExportImportModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AudioProvider>
          <TaskProvider>
            <MainLayout />
          </TaskProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
