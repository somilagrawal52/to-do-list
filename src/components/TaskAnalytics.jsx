import { useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  TrendingUp,
  Target
} from 'lucide-react'

export default function TaskAnalytics() {
  const { tasks, categories, stats } = useTasks()

  // Calculate 7-day completion velocity
  const last7DaysData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString(undefined, { weekday: 'short' })

      const completedCount = tasks.filter((t) => {
        if (!t.completedAt) return false
        return t.completedAt.slice(0, 10) === dateStr
      }).length

      const createdCount = tasks.filter((t) => {
        if (!t.createdAt) return false
        return t.createdAt.slice(0, 10) === dateStr
      }).length

      days.push({ dateStr, label, completedCount, createdCount })
    }
    return days
  }, [tasks])

  const maxDailyCount = Math.max(1, ...last7DaysData.map((d) => Math.max(d.completedCount, d.createdCount)))

  // Total Pomodoro sessions
  const totalPomodoros = useMemo(() => {
    return tasks.reduce((sum, t) => sum + (t.completedPomodoros || 0), 0)
  }, [tasks])

  // Priority distribution
  const priorityDistribution = useMemo(() => {
    const total = Math.max(1, tasks.length)
    const counts = { urgent: 0, high: 0, medium: 0, low: 0 }
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) counts[t.priority]++
    })
    return [
      { key: 'urgent', label: 'Urgent', count: counts.urgent, percent: Math.round((counts.urgent / total) * 100), color: 'bg-rose-500' },
      { key: 'high', label: 'High', count: counts.high, percent: Math.round((counts.high / total) * 100), color: 'bg-amber-500' },
      { key: 'medium', label: 'Medium', count: counts.medium, percent: Math.round((counts.medium / total) * 100), color: 'bg-blue-500' },
      { key: 'low', label: 'Low', count: counts.low, percent: Math.round((counts.low / total) * 100), color: 'bg-slate-400' }
    ]
  }, [tasks])

  // Category distribution
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat.id)
      const catCompleted = catTasks.filter((t) => t.completed).length
      const rate = catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0
      return {
        ...cat,
        total: catTasks.length,
        completed: catCompleted,
        rate
      }
    })
  }, [tasks, categories])

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.completionRate}%
              </span>
              <span className="text-xs text-slate-400">
                ({stats.completed}/{stats.total})
              </span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Due Today / Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Due Today
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.dueToday}
              </span>
              <span className="text-xs text-slate-400">tasks</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Deadlines */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overdue Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                {stats.overdue}
              </span>
              <span className="text-xs text-slate-400">needs action</span>
            </div>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Pomodoros / Focus */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Focus Blocks Done
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-amber-500">
                {totalPomodoros}
              </span>
              <span className="text-xs text-slate-400">
                ({totalPomodoros * 25} mins)
              </span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Completion Velocity Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                7-Day Activity Velocity
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" /> Added
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="mt-6 flex items-end justify-between gap-2 h-48 pt-6">
            {last7DaysData.map((d, idx) => {
              const compHeight = Math.max(8, (d.completedCount / maxDailyCount) * 140)
              const addedHeight = Math.max(8, (d.createdCount / maxDailyCount) * 140)

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.completedCount}
                  </div>
                  <div className="w-full max-w-[28px] flex items-end justify-center gap-1">
                    <div
                      className="w-1/2 bg-slate-200 dark:bg-slate-700 rounded-t-md transition-all duration-300"
                      style={{ height: `${addedHeight}px` }}
                      title={`${d.createdCount} tasks added on ${d.label}`}
                    />
                    <div
                      className="w-1/2 bg-indigo-600 hover:bg-indigo-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${compHeight}px` }}
                      title={`${d.completedCount} tasks completed on ${d.label}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Target className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Task Breakdown by Priority
              </h3>
            </div>

            <div className="mt-6 space-y-4">
              {priorityDistribution.map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-400">
                      {item.count} tasks ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Productivity Score:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {stats.completionRate >= 80 ? '🌟 Exceptional' : stats.completionRate >= 50 ? '⚡ Strong Momentum' : '🌱 Building Rhythm'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Workspace Category Performance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categoryStats.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {cat.name}
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {cat.completed}/{cat.total}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: cat.color,
                    width: `${cat.rate}%`
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cat.rate}% done
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
