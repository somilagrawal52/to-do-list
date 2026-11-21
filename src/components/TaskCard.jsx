import { useTasks } from '../context/TaskContext'
import {
  Check,
  Calendar,
  Pin,
  Flame,
  CheckSquare,
  Edit2,
  Trash2
} from 'lucide-react'
import { formatFriendlyDate, isOverdue, isToday, isTomorrow } from '../utils/dateUtils'

export default function TaskCard({ task, isCompact = false, onDragStart }) {
  const {
    toggleTaskCompletion,
    deleteTask,
    setModalTask,
    setPomodoroTask,
    setIsPomodoroOpen,
    categories,
    selectedTaskIds,
    toggleSelectTask
  } = useTasks()

  const isSelected = selectedTaskIds.includes(task.id)
  const categoryObj = categories.find((c) => c.id === task.category) || {
    name: 'General',
    color: '#6366f1'
  }

  const subtasksCount = (task.subtasks || []).length
  const subtasksCompleted = (task.subtasks || []).filter((s) => s.completed).length
  const subtasksPercent = subtasksCount > 0 ? (subtasksCompleted / subtasksCount) * 100 : 0

  const overdue = isOverdue(task.dueDate, task.completed)
  const dueToday = isToday(task.dueDate)
  const dueTomorrow = isTomorrow(task.dueDate)

  // Priority Styles
  const priorityConfig = {
    urgent: {
      label: 'Urgent',
      classes: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
    },
    high: {
      label: 'High',
      classes: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
    },
    medium: {
      label: 'Medium',
      classes: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60'
    },
    low: {
      label: 'Low',
      classes: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
    }
  }

  const priorityStyle = priorityConfig[task.priority] || priorityConfig.medium

  const handleStartFocus = (e) => {
    e.stopPropagation()
    setPomodoroTask(task)
    setIsPomodoroOpen(true)
  }

  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
          : isSelected
          ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-400 dark:border-indigo-600 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start gap-3">
        {/* Selection Checkbox for Batch (appears on hover or when selected) */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            toggleSelectTask(task.id)
          }}
          className={`mt-0.5 cursor-pointer transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="Select for bulk action"
        >
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        {/* Complete Task Checkbox */}
        <button
          type="button"
          onClick={() => toggleTaskCompletion(task.id)}
          className={`shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer mt-0.5 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
          aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Title & Description */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setModalTask(task)}
        >
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold transition-all ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              }`}
            >
              {task.title}
            </h4>
            {task.isPinned && !task.completed && (
              <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            )}
          </div>

          {task.description && !isCompact && (
            <p
              className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={handleStartFocus}
            title="Start Pomodoro Focus"
            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setModalTask(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtasks Progress Bar (if task has subtasks) */}
      {subtasksCount > 0 && !isCompact && (
        <div className="mt-3 pl-12 pr-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3 h-3 text-emerald-500" />
              {subtasksCompleted}/{subtasksCount} checklist
            </span>
            <span className="font-semibold">{Math.round(subtasksPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${subtasksPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata Badges */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/80 dark:border-slate-800/60 pl-8">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Priority Badge */}
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${priorityStyle.classes}`}
          >
            {priorityStyle.label}
          </span>

          {/* Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: categoryObj.color }}
            />
            {categoryObj.name}
          </span>

          {/* Energy Level Badge */}
          {task.energyLevel === 'high' && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
              ⚡ Deep Work
            </span>
          )}
          {task.energyLevel === 'low' && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              ☕ Quick Win
            </span>
          )}

          {/* Tags */}
          {(task.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Due Date & Pomodoro Counter */}
        <div className="flex items-center gap-2">
          {task.completedPomodoros > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400"
              title={`${task.completedPomodoros} focus pomodoros completed`}
            >
              <Flame className="w-3 h-3 fill-current" />
              <span>{task.completedPomodoros}</span>
            </span>
          )}

          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                overdue
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50'
                  : dueToday
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50'
                  : dueTomorrow
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span>
                {overdue ? 'Overdue: ' : ''}
                {formatFriendlyDate(task.dueDate)}
                {task.dueTime ? ` @ ${task.dueTime}` : ''}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
