import { useState, useEffect, useRef } from 'react'
import { useTasks } from '../context/TaskContext'
import { useAudio } from '../context/AudioContext'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  X,
  Flame,
  Headphones
} from 'lucide-react'
import Modal from './common/Modal'

const MODES = {
  work: { label: 'Focus Work', duration: 25 * 60, color: 'text-indigo-600 dark:text-indigo-400' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-emerald-600 dark:text-emerald-400' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-blue-600 dark:text-blue-400' }
}

export default function PomodoroTimer() {
  const { pomodoroTask, setPomodoroTask, isPomodoroOpen, setIsPomodoroOpen, incrementPomodoro, showToast } = useTasks()
  const { playTimer, playCelebrate, activeAmbient, toggleAmbient } = useAudio()

  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)
  const endTimeRef = useRef(null)

  // Sync mode changes
  const changeMode = (newMode) => {
    setIsRunning(false)
    endTimeRef.current = null
    setMode(newMode)
    setTimeLeft(MODES[newMode].duration)
  }

  // Timer tick with wall-clock timestamp synchronization to survive background tab throttling
  useEffect(() => {
    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000
      }

      const syncTick = () => {
        if (!endTimeRef.current) return
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
        setTimeLeft(remaining)

        if (remaining <= 0) {
          clearInterval(timerRef.current)
          endTimeRef.current = null
          setIsRunning(false)
          playTimer()

          if (mode === 'work') {
            if (pomodoroTask) {
              incrementPomodoro(pomodoroTask.id)
              showToast(`Session complete! +1 Pomodoro for "${pomodoroTask.title}"`, {
                type: 'success'
              })
            } else {
              showToast('Focus session complete! Time for a short break.', { type: 'success' })
            }
            playCelebrate()
          } else {
            showToast('Break finished! Ready to focus again?', { type: 'info' })
          }
        }
      }

      timerRef.current = setInterval(syncTick, 1000)

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          syncTick()
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    } else {
      endTimeRef.current = null
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, mode, pomodoroTask, incrementPomodoro, playTimer, playCelebrate, showToast, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progressPercent = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100

  return (
    <Modal
      isOpen={isPomodoroOpen}
      onClose={() => setIsPomodoroOpen(false)}
      maxWidth="max-w-sm"
      title="Focus Pomodoro"
      icon={Flame}
      iconColor="bg-amber-50 dark:bg-amber-950/40 text-amber-500"
    >
      {/* Linked Task Banner */}
      {pomodoroTask ? (
        <div className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center justify-between text-xs mb-3">
          <div className="min-w-0 pr-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Focusing on:</span>
            <p className="font-bold text-indigo-700 dark:text-indigo-300 truncate">
              {pomodoroTask.title}
            </p>
          </div>
          <button
            onClick={() => setPomodoroTask(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
          Tip: Link any task from the list to count focus blocks
        </p>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl my-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => changeMode('work')}
          className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
            mode === 'work'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Work (25m)
        </button>
        <button
          type="button"
          onClick={() => changeMode('shortBreak')}
          className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Short (5m)
        </button>
        <button
          type="button"
          onClick={() => changeMode('longBreak')}
          className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Long (15m)
        </button>
      </div>

      {/* Circular Display */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 76}
              strokeDashoffset={2 * Math.PI * 76 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                mode === 'work'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : mode === 'shortBreak'
                  ? 'text-emerald-500'
                  : 'text-blue-500'
              }`}
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {formattedTime}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mt-1">
              {MODES[mode].label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => {
            setIsRunning(false)
            endTimeRef.current = null
            setTimeLeft(MODES[mode].duration)
          }}
          title="Reset"
          className="p-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isRunning) {
              endTimeRef.current = Date.now() + timeLeft * 1000
            } else {
              endTimeRef.current = null
            }
            setIsRunning(!isRunning)
          }}
          className={`px-8 py-3 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span className="text-sm">Start</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (mode === 'work') changeMode('shortBreak')
            else changeMode('work')
          }}
          title="Skip to next session"
          className="p-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Ambient Soundscapes Selector */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-indigo-500" />
            Focus Ambient Sound
          </span>
          {activeAmbient && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ● Playing
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => toggleAmbient('brown')}
            className={`py-1.5 px-2 rounded-xl border transition-all cursor-pointer text-center ${
              activeAmbient === 'brown'
                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🌊 Brown Noise
          </button>
          <button
            type="button"
            onClick={() => toggleAmbient('rain')}
            className={`py-1.5 px-2 rounded-xl border transition-all cursor-pointer text-center ${
              activeAmbient === 'rain'
                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🌧️ Soft Rain
          </button>
          <button
            type="button"
            onClick={() => toggleAmbient('alpha')}
            className={`py-1.5 px-2 rounded-xl border transition-all cursor-pointer text-center ${
              activeAmbient === 'alpha'
                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🧠 10Hz Alpha
          </button>
        </div>
      </div>
    </Modal>
  )
}
