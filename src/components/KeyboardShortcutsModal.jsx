import { X, Command } from 'lucide-react'

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const shortcuts = [
    { key: 'Ctrl + K / ⌘ + K', desc: 'Open Command Palette' },
    { key: 'N', desc: 'Create new task' },
    { key: '/', desc: 'Focus instant search bar' },
    { key: '1', desc: 'Switch to List View' },
    { key: '2', desc: 'Switch to Kanban Board View' },
    { key: '3', desc: 'Switch to Eisenhower Matrix' },
    { key: '4', desc: 'Switch to Calendar View' },
    { key: '5', desc: 'Switch to Analytics Dashboard' },
    { key: 'P', desc: 'Toggle Pomodoro Focus Timer' },
    { key: 'A', desc: 'Toggle Ambient Focus Soundscape' },
    { key: 'S', desc: 'Open Daily Shutdown Ritual' },
    { key: 'D', desc: 'Toggle Dark / Light theme' },
    { key: '?', desc: 'Open Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close any active modal or drawer' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speed up your workflow with hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                {s.desc}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
