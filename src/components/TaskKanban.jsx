import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'
import { Plus, CheckCircle, Clock, Eye, AlertCircle } from 'lucide-react'

const COLUMNS = [
  { id: 'todo', title: 'To Do', icon: Clock, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
  { id: 'in-progress', title: 'In Progress', icon: AlertCircle, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  { id: 'review', title: 'In Review', icon: Eye, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'completed', title: 'Done', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' }
]

export default function TaskKanban() {
  const { filteredTasks, updateTask, setModalTask } = useTasks()
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [activeOverCol, setActiveOverCol] = useState(null)

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, colId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (activeOverCol !== colId) {
      setActiveOverCol(colId)
    }
  }

  const handleDragLeave = (e, colId) => {
    if (activeOverCol === colId) {
      setActiveOverCol(null)
    }
  }

  const handleDrop = (e, colId) => {
    e.preventDefault()
    setActiveOverCol(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (taskId) {
      updateTask(taskId, {
        status: colId,
        completed: colId === 'completed'
      })
    }
    setDraggedTaskId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start min-h-[600px]">
      {COLUMNS.map((col) => {
        const Icon = col.icon
        const colTasks = filteredTasks.filter((t) => {
          if (col.id === 'completed') return t.completed || t.status === 'completed'
          return (t.status || 'todo') === col.id && !t.completed
        })
        const isDraggingOver = activeOverCol === col.id

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col bg-slate-50/70 dark:bg-slate-900/40 rounded-3xl p-4 border transition-all min-h-[480px] ${
              isDraggingOver
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20'
                : 'border-slate-200/80 dark:border-slate-800/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {col.title}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalTask({
                    status: col.id,
                    completed: col.id === 'completed'
                  })
                }
                title={`Add task to ${col.title}`}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                  Drag items here
                </div>
              ) : (
                colTasks.map((task) => (
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
  )
}
