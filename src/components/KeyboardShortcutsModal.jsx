import { Command } from 'lucide-react'
import Modal from './common/Modal'

const SHORTCUTS = [
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

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title="Keyboard Shortcuts"
      subtitle="Speed up your workflow with hotkeys"
      icon={Command}
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto pr-1">
        {SHORTCUTS.map((s, idx) => (
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
    </Modal>
  )
}
