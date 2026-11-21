import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import {
  Inbox,
  Calendar,
  CalendarDays,
  Star,
  CheckCircle,
  Plus,
  Flame,
  X
} from 'lucide-react'
import { isToday, isOverdue } from '../utils/dateUtils'

const COLOR_PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444', '#64748b']

const ENERGY_OPTIONS = [
  {
    filter: 'energy:high',
    icon: '⚡',
    label: 'Deep Work',
    activeClass: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold',
    badgeColor: 'text-purple-500',
    predicate: (t) => !t.completed && (t.energyLevel === 'high' || t.priority === 'urgent')
  },
  {
    filter: 'energy:low',
    icon: '☕',
    label: 'Quick Wins (<15m)',
    activeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold',
    badgeColor: 'text-emerald-500',
    predicate: (t) => !t.completed && (t.energyLevel === 'low' || (t.estimatedPomodoros <= 1 && t.priority !== 'urgent'))
  }
]

export default function Sidebar({ isOpen, onClose }) {
  const {
    tasks,
    categories,
    activeFilter,
    setActiveFilter,
    addCategory,
    deleteCategory,
    stats
  } = useTasks()

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('#3b82f6')

  // Calculate counts for filters
  const allCount = tasks.filter((t) => !t.completed).length
  const todayCount = tasks.filter((t) => (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed)) && !t.completed).length
  const upcomingCount = tasks.filter((t) => t.dueDate && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.completed) && !t.completed).length
  const importantCount = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high' || t.isPinned) && !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  // Extract all unique tags
  const allTags = Array.from(
    new Set(tasks.flatMap((t) => t.tags || []))
  ).filter(Boolean)

  const handleCreateCategory = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    addCategory({
      name: newCatName.trim(),
      color: newCatColor
    })
    setNewCatName('')
    setIsAddingCategory(false)
  }

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: allCount },
    { id: 'today', label: 'Today', icon: Calendar, count: todayCount, highlight: todayCount > 0 },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: upcomingCount },
    { id: 'important', label: 'Important', icon: Star, count: importantCount },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: completedCount }
  ]

  const handleFilterSelect = (filterId) => {
    setActiveFilter(filterId)
    if (window.innerWidth < 1024) onClose()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-800 dark:text-white">Workspace Menu</span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Filters */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview
            </span>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeFilter === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFilterSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : item.highlight
                            ? 'text-indigo-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
                            : item.highlight
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Energy & Focus Filter Section */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Focus & Energy
            </span>
            <div className="mt-2 space-y-1">
              {ENERGY_OPTIONS.map((opt) => {
                const isActive = activeFilter === opt.filter
                const count = tasks.filter(opt.predicate).length
                return (
                  <button
                    key={opt.filter}
                    type="button"
                    onClick={() => handleFilterSelect(isActive ? 'all' : opt.filter)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? opt.activeClass
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={opt.badgeColor}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md cursor-pointer"
                title="Create category"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inline Category Creation */}
            {isAddingCategory && (
              <form onSubmit={handleCreateCategory} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                />
                <div className="flex items-center gap-1.5">
                  {COLOR_PALETTE.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                        newCatColor === col ? 'scale-125 ring-2 ring-indigo-500 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2 py-1 text-[11px] text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-[11px] font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-0.5">
              {categories.map((cat) => {
                const catFilterId = `cat:${cat.id}`
                const isActive = activeFilter === catFilterId
                const catCount = tasks.filter((t) => t.category === cat.id && !t.completed).length

                return (
                  <div
                    key={cat.id}
                    className="group flex items-center justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => handleFilterSelect(catFilterId)}
                      className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate max-w-[140px]">{cat.name}</span>
                      </div>
                      {catCount > 0 && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {catCount}
                        </span>
                      )}
                    </button>

                    {/* Delete Custom Category button on hover */}
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer transition-opacity"
                        title="Delete category"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tags Cloud Filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5 px-3">
                {allTags.map((tag) => {
                  const tagFilterId = `tag:${tag}`
                  const isActive = activeFilter === tagFilterId

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleFilterSelect(isActive ? 'all' : tagFilterId)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Productivity Widget */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/20 border border-indigo-100/80 dark:border-indigo-900/40">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-current" />
                <span>Daily Velocity</span>
              </span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                {stats.completionRate}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {stats.completed} of {stats.total} total tasks completed
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
