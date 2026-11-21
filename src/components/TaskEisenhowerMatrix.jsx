import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'
import {
  AlertCircle,
  Calendar,
  UserCheck,
  Trash2,
  Plus,
  HelpCircle
} from 'lucide-react'
import { isToday, isOverdue } from '../utils/dateUtils'

export default function TaskEisenhowerMatrix() {
  const { filteredTasks, updateTask, setModalTask } = useTasks()
  const [activeDropQuad, setActiveDropQuad] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  // Segment tasks into 4 quadrants
  const quadrants = useMemo(() => {
    const q1 = [] // Urgent & Important (Do First)
    const q2 = [] // Not Urgent & Important (Schedule)
    const q3 = [] // Urgent & Not Important (Delegate)
    const q4 = [] // Neither (Eliminate)

    filteredTasks.forEach((t) => {
      if (t.completed) return // focus matrix on active tasks

      const isUrgent = t.priority === 'urgent' || (t.dueDate && (isToday(t.dueDate) || isOverdue(t.dueDate)))
      const isImportant = t.priority === 'urgent' || t.priority === 'high' || t.isPinned

      if (isUrgent && isImportant) {
        q1.push(t)
      } else if (!isUrgent && isImportant) {
        q2.push(t)
      } else if (isUrgent && !isImportant) {
        q3.push(t)
      } else {
        q4.push(t)
      }
    })

    return { q1, q2, q3, q4 }
  }, [filteredTasks])

  // Drag and drop handler
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, quadId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (activeDropQuad !== quadId) {
      setActiveDropQuad(quadId)
    }
  }

  const handleDrop = (e, quadId) => {
    e.preventDefault()
    setActiveDropQuad(null)
    const taskId = e.dataTransfer.getData('text/plain')
    if (!taskId) return

    if (quadId === 'q1') {
      // Urgent & Important
      updateTask(taskId, { priority: 'urgent', isPinned: true })
    } else if (quadId === 'q2') {
      // Important & Not Urgent
      updateTask(taskId, { priority: 'high', isPinned: false })
    } else if (quadId === 'q3') {
      // Urgent & Not Important
      updateTask(taskId, { priority: 'medium', isPinned: false })
    } else if (quadId === 'q4') {
      // Neither
      updateTask(taskId, { priority: 'low', isPinned: false })
    }
  }

  const QUAD_CONFIG = [
    {
      id: 'q1',
      title: 'Do First',
      subtitle: 'Urgent & Important',
      desc: 'Crises, pressing deadlines, and critical blockers. Execute immediately.',
      icon: AlertCircle,
      tasks: quadrants.q1,
      headerBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
      badgeBg: 'bg-rose-500 text-white',
      borderColor: 'border-rose-200 dark:border-rose-900/60'
    },
    {
      id: 'q2',
      title: 'Schedule (Deep Work)',
      subtitle: 'Important, Not Urgent',
      desc: 'Strategic thinking, learning, core features, and health. The quadrant of growth.',
      icon: Calendar,
      tasks: quadrants.q2,
      headerBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
      badgeBg: 'bg-indigo-600 text-white',
      borderColor: 'border-indigo-200 dark:border-indigo-900/60'
    },
    {
      id: 'q3',
      title: 'Delegate / Batch',
      subtitle: 'Urgent, Not Important',
      desc: 'Routine requests, invoice filing, and administrative noise. Batch or automate.',
      icon: UserCheck,
      tasks: quadrants.q3,
      headerBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
      badgeBg: 'bg-amber-500 text-white',
      borderColor: 'border-amber-200 dark:border-amber-900/60'
    },
    {
      id: 'q4',
      title: 'Eliminate',
      subtitle: 'Not Urgent & Not Important',
      desc: 'Busywork, trivial distractions, and outdated goals. Prune ruthlessly.',
      icon: Trash2,
      tasks: quadrants.q4,
      headerBg: 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      badgeBg: 'bg-slate-400 text-white',
      borderColor: 'border-slate-200 dark:border-slate-800'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Matrix Strategy Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Eisenhower Decision Matrix
            </h2>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              title="What is the Eisenhower Matrix?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize tasks by urgency & importance to focus on high-leverage outcomes. Drag cards between quadrants to reprioritize.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
            Q2 Focus Target: ≥ 50%
          </span>
        </div>
      </div>

      {showGuide && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 animate-in fade-in">
          <p className="font-bold">💡 How top performers use the Eisenhower Matrix:</p>
          <p>
            Spend 70% of your time in <strong>Quadrant 2 (Important, Not Urgent)</strong>. This builds long-term leverage and prevents fires from ever reaching Quadrant 1.
          </p>
        </div>
      )}

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {QUAD_CONFIG.map((quad) => {
          const Icon = quad.icon
          const isOver = activeDropQuad === quad.id

          return (
            <div
              key={quad.id}
              onDragOver={(e) => handleDragOver(e, quad.id)}
              onDragLeave={() => setActiveDropQuad(null)}
              onDrop={(e) => handleDrop(e, quad.id)}
              className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all min-h-[380px] ${
                isOver
                  ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20'
                  : quad.borderColor
              }`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${quad.headerBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {quad.title}
                      </h3>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${quad.badgeBg}`}
                      >
                        {quad.tasks.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {quad.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (quad.id === 'q1') setModalTask({ priority: 'urgent', isPinned: true })
                    else if (quad.id === 'q2') setModalTask({ priority: 'high' })
                    else if (quad.id === 'q3') setModalTask({ priority: 'medium' })
                    else setModalTask({ priority: 'low' })
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={`Add task to ${quad.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 mb-3">
                {quad.desc}
              </p>

              {/* Tasks in Quadrant */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {quad.tasks.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                    No active tasks here. Drag items to assign.
                  </div>
                ) : (
                  quad.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompact={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
