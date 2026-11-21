import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import { useAudio } from '../context/AudioContext'
import {
  Moon,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react'
import { isToday, getTomorrowString } from '../utils/dateUtils'
import Modal from './common/Modal'

export default function DailyShutdownModal({ isOpen, onClose }) {
  const { tasks, updateTask, triggerConfetti, showToast } = useTasks()
  const { playCelebrate } = useAudio()
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1) // 1: review, 2: triage, 3: completed

  // Tasks completed today
  const completedToday = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.completed) return false
      if (!t.completedAt) return isToday(t.dueDate)
      return isToday(t.completedAt.slice(0, 10))
    })
  }, [tasks])

  // Incomplete tasks scheduled for today
  const pendingToday = useMemo(() => {
    return tasks.filter((t) => !t.completed && isToday(t.dueDate))
  }, [tasks])

  const totalPomodorosToday = useMemo(() => {
    return completedToday.reduce((sum, t) => sum + (t.completedPomodoros || 0), 0)
  }, [completedToday])

  const handleRollOverToTomorrow = () => {
    const tomorrow = getTomorrowString()
    pendingToday.forEach((t) => {
      updateTask(t.id, { dueDate: tomorrow })
    })
    showToast(`Rolled over ${pendingToday.length} tasks to tomorrow`, { type: 'info' })
    setStep(3)
    playCelebrate()
    triggerConfetti()
  }

  const handleLeaveInInbox = () => {
    setStep(3)
    playCelebrate()
    triggerConfetti()
  }

  const handleCopyStandup = () => {
    const dateStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })

    const lines = [
      `📋 Daily Standup Summary (${dateStr}):`,
      `✅ Completed (${completedToday.length}):`,
      ...completedToday.map((t) => `  - ${t.title}`),
      pendingToday.length > 0 ? `⏳ In Progress / Rollover (${pendingToday.length}):` : '',
      ...pendingToday.map((t) => `  - ${t.title}`),
      `🔥 Focus Sessions: ${totalPomodorosToday} Pomodoros (${totalPomodorosToday * 25} mins)`
    ].filter(Boolean)

    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast('Copied daily standup to clipboard!', { type: 'success' })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title="Daily Shutdown Ritual"
      subtitle="Close your open loops, celebrate progress, and disconnect"
      icon={Moon}
      iconColor="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
    >
      {/* Step 1: Accomplishment Summary */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {completedToday.length}
              </span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Tasks Finished Today
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <span className="text-3xl font-extrabold text-amber-500">
                {totalPomodorosToday * 25}m
              </span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Deep Focus Logged
              </p>
            </div>
          </div>

          {completedToday.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                What you shipped today:
              </label>
              <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {completedToday.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 py-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={handleCopyStandup}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Daily Standup'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (pendingToday.length > 0) setStep(2)
                else {
                  setStep(3)
                  triggerConfetti()
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Unfinished Tasks Triage */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Unfinished Tasks ({pendingToday.length})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Don't carry unfinished guilt into your evening. Decide how to handle them:
            </p>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {pendingToday.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs"
              >
                <span className="truncate font-medium text-slate-800 dark:text-slate-200 max-w-[280px]">
                  {t.title}
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                  Due Today
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleRollOverToTomorrow}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
            >
              🌅 Roll all over to Tomorrow
            </button>
            <button
              type="button"
              onClick={handleLeaveInInbox}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Keep as is
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Shutdown Complete & Disconnect */}
      {step === 3 && (
        <div className="text-center space-y-6 pt-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Shutdown Complete ✨
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
              All loops are closed. Give yourself permission to disconnect from work and recharge for tomorrow.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Enjoy Your Evening 🌙
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
