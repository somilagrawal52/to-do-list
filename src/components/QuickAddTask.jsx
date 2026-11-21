import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import { Plus, Maximize2, Sparkles } from 'lucide-react'
import { getTodayString, getTomorrowString } from '../utils/dateUtils'
import { parseNaturalLanguageTask } from '../utils/nlpParser'
import { PRIORITY_LIST } from '../constants/taskConstants'

export default function QuickAddTask() {
  const { addTask, categories, setModalTask } = useTasks()

  const [rawInput, setRawInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState(categories[0]?.id || 'work')
  const [isExpanded, setIsExpanded] = useState(false)

  // Live NLP parsing
  const nlpParsed = useMemo(() => {
    return parseNaturalLanguageTask(rawInput, categories)
  }, [rawInput, categories])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rawInput.trim()) return

    const effectiveTitle = nlpParsed.cleanTitle || rawInput.trim()
    const effectiveDueDate = nlpParsed.dueDate || dueDate
    const effectiveDueTime = nlpParsed.dueTime || ''
    const effectivePriority = nlpParsed.priority || priority
    const effectiveCategory = nlpParsed.category || category
    const effectivePomodoros = nlpParsed.estimatedPomodoros || 1
    const effectiveTags = nlpParsed.tags || []
    const effectiveEnergy = nlpParsed.energyLevel || 'medium'

    addTask({
      title: effectiveTitle,
      dueDate: effectiveDueDate,
      dueTime: effectiveDueTime,
      priority: effectivePriority,
      category: effectiveCategory,
      estimatedPomodoros: effectivePomodoros,
      tags: effectiveTags,
      energyLevel: effectiveEnergy
    })

    setRawInput('')
    setDueDate('')
    setPriority('medium')
    setIsExpanded(false)
  }

  const handleOpenDetailedModal = () => {
    setModalTask({
      title: nlpParsed.cleanTitle || rawInput.trim(),
      dueDate: nlpParsed.dueDate || dueDate,
      dueTime: nlpParsed.dueTime || '',
      priority: nlpParsed.priority || priority,
      category: nlpParsed.category || category,
      estimatedPomodoros: nlpParsed.estimatedPomodoros || 1,
      tags: nlpParsed.tags || [],
      energyLevel: nlpParsed.energyLevel || 'medium'
    })
    setRawInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs transition-all focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
          <Plus className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder='Try typing: "Deploy v2 tomorrow 3pm !urgent #work @2p ~deep"'
          className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
        />

        <div className="flex items-center gap-2">
          {rawInput.trim() && (
            <button
              type="button"
              onClick={handleOpenDetailedModal}
              title="Add more details, subtasks & notes"
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!rawInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Live Natural Language Entity Detection Chips */}
      {nlpParsed.detectedEntities.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1.5 animate-in fade-in duration-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3" /> Auto-detected:
          </span>
          {nlpParsed.detectedEntities.map((entity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
            >
              {entity.label}
            </span>
          ))}
        </div>
      )}

      {/* Quick configuration chips */}
      {(isExpanded || rawInput.length > 0) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Due Date Chips */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDueDate(dueDate === getTodayString() ? '' : getTodayString())}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  (nlpParsed.dueDate || dueDate) === getTodayString()
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDueDate(dueDate === getTomorrowString() ? '' : getTomorrowString())}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  (nlpParsed.dueDate || dueDate) === getTomorrowString()
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Tomorrow
              </button>
              <input
                type="date"
                value={nlpParsed.dueDate || dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-hidden"
              />
            </div>

            {/* Priority Selector */}
            <select
              value={nlpParsed.priority || priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {PRIORITY_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emojiLabel}
                </option>
              ))}
            </select>

            {/* Category Selector */}
            <select
              value={nlpParsed.category || category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-400">
            Press <kbd className="font-mono font-semibold">Enter ↵</kbd> to save
          </span>
        </div>
      )}
    </form>
  )
}
