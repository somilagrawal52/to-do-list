import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'
import {
  CheckCircle,
  Trash2,
  X,
  FolderOpen,
  ArrowUpDown
} from 'lucide-react'
import { isToday, isTomorrow, isOverdue } from '../utils/dateUtils'
import { PRIORITY_LIST } from '../constants/taskConstants'

export default function TaskList() {
  const {
    filteredTasks,
    tasks,
    categories,
    selectedTaskIds,
    selectAllVisible,
    clearSelection,
    batchComplete,
    batchDelete,
    sortBy,
    setSortBy,
    setActiveFilter,
    loadDemoData,
    setModalTask
  } = useTasks()

  const [groupBy, setGroupBy] = useState('date') // 'none' | 'date' | 'priority' | 'category'

  // Visible task IDs for batch select
  const visibleIds = useMemo(() => filteredTasks.map((t) => t.id), [filteredTasks])
  const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedTaskIds.includes(id))

  // Grouped tasks memo
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: 'All Tasks', tasks: filteredTasks }]
    }

    if (groupBy === 'date') {
      const overdue = []
      const today = []
      const tomorrow = []
      const later = []
      const noDate = []

      filteredTasks.forEach((t) => {
        if (!t.dueDate) {
          noDate.push(t)
        } else if (isOverdue(t.dueDate, t.completed)) {
          overdue.push(t)
        } else if (isToday(t.dueDate)) {
          today.push(t)
        } else if (isTomorrow(t.dueDate)) {
          tomorrow.push(t)
        } else {
          later.push(t)
        }
      })

      const groups = []
      if (overdue.length > 0) groups.push({ key: 'overdue', title: '⚠️ Overdue Deadlines', color: 'text-rose-600', tasks: overdue })
      if (today.length > 0) groups.push({ key: 'today', title: '📅 Due Today', color: 'text-indigo-600', tasks: today })
      if (tomorrow.length > 0) groups.push({ key: 'tomorrow', title: '🌅 Tomorrow', color: 'text-amber-600', tasks: tomorrow })
      if (later.length > 0) groups.push({ key: 'later', title: '🗓️ Upcoming Later', color: 'text-slate-600', tasks: later })
      if (noDate.length > 0) groups.push({ key: 'noDate', title: '📌 Someday / No Due Date', color: 'text-slate-500', tasks: noDate })

      return groups
    }

    if (groupBy === 'priority') {
      return PRIORITY_LIST
        .map((p) => ({
          key: p.id,
          title: p.emojiLabel,
          tasks: filteredTasks.filter((t) => t.priority === p.id)
        }))
        .filter((g) => g.tasks.length > 0)
    }

    if (groupBy === 'category') {
      const validCatIds = new Set(categories.map((c) => c.id))
      const groups = categories
        .map((cat) => ({
          key: cat.id,
          title: cat.name,
          color: cat.color,
          tasks: filteredTasks.filter((t) => t.category === cat.id)
        }))
        .filter((g) => g.tasks.length > 0)

      const uncategorizedTasks = filteredTasks.filter(
        (t) => !t.category || !validCatIds.has(t.category)
      )
      if (uncategorizedTasks.length > 0) {
        groups.push({
          key: 'uncategorized',
          title: '📁 General / Uncategorized',
          color: '#94a3b8',
          tasks: uncategorizedTasks
        })
      }
      return groups
    }

    return [{ key: 'all', title: 'All Tasks', tasks: filteredTasks }]
  }, [filteredTasks, groupBy, categories])

  return (
    <div className="space-y-6">
      {/* View Toolbar: Grouping, Sorting, Batch selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Group by selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 pl-2">Group:</span>
            <button
              type="button"
              onClick={() => setGroupBy('date')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                groupBy === 'date'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Date
            </button>
            <button
              type="button"
              onClick={() => setGroupBy('priority')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                groupBy === 'priority'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Priority
            </button>
            <button
              type="button"
              onClick={() => setGroupBy('category')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                groupBy === 'category'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Category
            </button>
            <button
              type="button"
              onClick={() => setGroupBy('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                groupBy === 'none'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              None
            </button>
          </div>
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Recently Added</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Floating Batch Action Toolbar */}
      {selectedTaskIds.length > 0 && (
        <div className="sticky top-20 z-20 flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 shadow-xl border border-slate-700 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold bg-indigo-600 rounded-lg">
              {selectedTaskIds.length} Selected
            </span>
            <button
              type="button"
              onClick={() => {
                if (isAllSelected) clearSelection()
                else selectAllVisible(visibleIds)
              }}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {isAllSelected ? 'Deselect All' : 'Select All Visible'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={batchComplete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>

            <button
              type="button"
              onClick={batchDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={clearSelection}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No tasks found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            {tasks.length === 0
              ? 'Your workspace is completely empty. Create a task or load our demo suite to get started.'
              : 'No tasks match your current filter or search criteria.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalTask('new')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              + Create New Task
            </button>
            {tasks.length === 0 ? (
              <button
                type="button"
                onClick={loadDemoData}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Load Demo Workspace
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Clear Filter (Show All)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grouped Task List */}
      <div className="space-y-6">
        {groupedTasks.map((group) => (
          <div key={group.key} className="space-y-3">
            {groupBy !== 'none' && (
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  {group.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                  )}
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${group.color || 'text-slate-500 dark:text-slate-400'}`}>
                    {group.title}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {group.tasks.length}
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {group.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
