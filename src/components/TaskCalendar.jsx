import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react'
import { getTodayString } from '../utils/dateUtils'
import { PRIORITIES } from '../constants/taskConstants'

export default function TaskCalendar() {
  const { tasks, setModalTask } = useTasks()

  const todayStr = getTodayString()
  const todayParts = todayStr.split('-').map(Number)

  const [currentYear, setCurrentYear] = useState(todayParts[0])
  const [currentMonth, setCurrentMonth] = useState(todayParts[1] - 1) // 0-indexed
  const [selectedDate, setSelectedDate] = useState(todayStr)

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const goToToday = () => {
    setCurrentYear(todayParts[0])
    setCurrentMonth(todayParts[1] - 1)
    setSelectedDate(todayStr)
  }

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() // 0 = Sun
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const days = []

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const m = currentMonth === 0 ? 12 : currentMonth
      const y = currentMonth === 0 ? currentYear - 1 : currentYear
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      days.push({ dayNum, dateStr, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ dayNum: i, dateStr, isCurrentMonth: true })
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2
      const y = currentMonth === 11 ? currentYear + 1 : currentYear
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ dayNum: i, dateStr, isCurrentMonth: false })
    }

    return days
  }, [currentYear, currentMonth])

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((t) => {
      if (t.dueDate) {
        if (!map[t.dueDate]) map[t.dueDate] = []
        map[t.dueDate].push(t)
      }
    })
    return map
  }, [tasks])

  const selectedDateTasks = tasksByDate[selectedDate] || []
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid Container (2 Cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {monthName}
            </h2>
            <button
              type="button"
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 pt-4 text-center text-xs font-bold uppercase text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {calendarDays.map((item, idx) => {
            const isToday = item.dateStr === todayStr
            const isSelected = item.dateStr === selectedDate
            const dayTasks = tasksByDate[item.dateStr] || []
            const hasUrgent = dayTasks.some((t) => t.priority === 'urgent' && !t.completed)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDate(item.dateStr)}
                className={`relative min-h-[72px] sm:min-h-[84px] p-1.5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : hasUrgent
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                    : isToday
                    ? 'border-indigo-300 dark:border-indigo-700 bg-slate-50/60 dark:bg-slate-800/40'
                    : 'border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent'
                } ${item.isCurrentMonth ? 'opacity-100' : 'opacity-35'}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.dayNum}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task Indicators */}
                <div className="flex flex-wrap gap-1 mt-1 justify-start">
                  {dayTasks.slice(0, 3).map((t, tIdx) => (
                    <div
                      key={tIdx}
                      className={`w-2 h-2 rounded-full ${
                        t.completed
                          ? 'bg-emerald-400'
                          : PRIORITIES[t.priority]?.color || 'bg-indigo-500'
                      }`}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Agenda Sidebar (1 Col) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scheduled Agenda
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedDate === todayStr ? 'Today, ' : ''}
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setModalTask({ dueDate: selectedDate })}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors cursor-pointer"
              title="Add task for this day"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {selectedDateTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No tasks due on this date</p>
                <button
                  type="button"
                  onClick={() => setModalTask({ dueDate: selectedDate })}
                  className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  + Schedule a task
                </button>
              </div>
            ) : (
              selectedDateTasks.map((task) => (
                <TaskCard key={task.id} task={task} isCompact={true} />
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{selectedDateTasks.filter((t) => t.completed).length} completed</span>
          <span>{selectedDateTasks.length} scheduled</span>
        </div>
      </div>
    </div>
  )
}
