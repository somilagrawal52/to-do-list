import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'
import { generateSampleTasks, DEFAULT_CATEGORIES } from '../utils/sampleData'
import { isToday, isOverdue, isUpcoming } from '../utils/dateUtils'
import { useAudio } from './AudioContext'

const TaskContext = createContext()

export function TaskProvider({ children }) {
  const { playComplete, playClick, playCelebrate } = useAudio()

  // Load Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.TASKS, null)
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved
    }
    // Initialize with rich sample data on first visit
    const initial = generateSampleTasks()
    saveToStorage(STORAGE_KEYS.TASKS, initial)
    return initial
  })

  // Load Categories
  const [categories, setCategories] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.CATEGORIES, null)
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
    return DEFAULT_CATEGORIES
  })

  // UI state
  const [activeView, setActiveView] = useState('list') // 'list' | 'board' | 'calendar' | 'analytics'
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'today' | 'upcoming' | 'important' | 'completed' | 'cat:<id>' | 'tag:<tag>'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate') // 'dueDate' | 'priority' | 'created' | 'title'
  const [selectedTaskIds, setSelectedTaskIds] = useState([])
  const [modalTask, setModalTask] = useState(null) // null | 'new' | Task object
  const [pomodoroTask, setPomodoroTask] = useState(null)
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  // Persist tasks on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks)
  }, [tasks])

  // Persist categories on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories)
  }, [categories])

  // Toast Notification System
  const showToast = useCallback((message, { type = 'info', actionText, onAction, duration = 4000 } = {}) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6)
    const newToast = { id, message, type, actionText, onAction }
    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Trigger Confetti Celebration
  const triggerConfetti = useCallback(() => {
    playCelebrate()
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, [playCelebrate])

  // Add Task
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: taskData.title?.trim() || 'Untitled Task',
      description: taskData.description || '',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      dueTime: taskData.dueTime || '',
      category: taskData.category || 'work',
      tags: taskData.tags || [],
      status: taskData.status || 'todo',
      isPinned: Boolean(taskData.isPinned),
      estimatedPomodoros: Number(taskData.estimatedPomodoros) || 1,
      energyLevel: taskData.energyLevel || 'medium',
      completedPomodoros: 0,
      subtasks: taskData.subtasks || []
    }

    setTasks((prev) => [newTask, ...prev])
    playClick()
    showToast(`Added "${newTask.title}"`, { type: 'success' })
    return newTask
  }, [playClick, showToast])

  // Update Task
  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const updated = {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString()
        }
        // If status changed to completed or marked completed
        if (updates.completed !== undefined) {
          updated.completed = updates.completed
          updated.completedAt = updates.completed ? new Date().toISOString() : null
          if (updates.completed) {
            updated.status = 'completed'
          } else if (t.status === 'completed') {
            updated.status = 'todo'
          }
        }
        if (updates.status) {
          if (updates.status === 'completed') {
            updated.completed = true
            updated.completedAt = updated.completedAt || new Date().toISOString()
          } else {
            updated.completed = false
            updated.completedAt = null
          }
        }
        return updated
      })
    )
  }, [])

  // Toggle Task Completion
  const toggleTaskCompletion = useCallback((id) => {
    let completedNow = false
    setTasks((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed
          completedNow = nextState
          return {
            ...t,
            completed: nextState,
            status: nextState ? 'completed' : 'todo',
            completedAt: nextState ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    })

    if (completedNow) {
      playComplete()
      // Check if all today's tasks are finished
      setTimeout(() => {
        setTasks((currentTasks) => {
          const todayTasks = currentTasks.filter((t) => isToday(t.dueDate))
          if (todayTasks.length > 0 && todayTasks.every((t) => t.completed)) {
            triggerConfetti()
            showToast('🎉 Outstanding! All of today\'s tasks are completed!', { type: 'success' })
          }
          return currentTasks
        })
      }, 300)
    } else {
      playClick()
    }
  }, [playComplete, playClick, triggerConfetti, showToast])

  // Delete Task with Undo Option
  const deleteTask = useCallback((id, withUndo = true) => {
    let deletedTask = null
    setTasks((prev) => {
      deletedTask = prev.find((t) => t.id === id)
      return prev.filter((t) => t.id !== id)
    })

    setSelectedTaskIds((prev) => prev.filter((item) => item !== id))

    if (withUndo && deletedTask) {
      showToast(`Deleted "${deletedTask.title}"`, {
        type: 'warning',
        actionText: 'Undo',
        onAction: () => {
          setTasks((prev) => [deletedTask, ...prev])
          showToast(`Restored "${deletedTask.title}"`, { type: 'info' })
        }
      })
    }
  }, [showToast])

  // Subtask helpers
  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const newSubtasks = (t.subtasks || []).map((sub) => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed }
          }
          return sub
        })
        const allCompleted = newSubtasks.length > 0 && newSubtasks.every((s) => s.completed)
        return {
          ...t,
          subtasks: newSubtasks,
          completed: allCompleted ? true : t.completed,
          status: allCompleted ? 'completed' : t.status,
          updatedAt: new Date().toISOString()
        }
      })
    )
    playClick()
  }, [playClick])

  const addSubtask = useCallback((taskId, title) => {
    if (!title?.trim()) return
    const newSub = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      title: title.trim(),
      completed: false
    }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          subtasks: [...(t.subtasks || []), newSub],
          updatedAt: new Date().toISOString()
        }
      })
    )
    playClick()
  }, [playClick])

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId),
          updatedAt: new Date().toISOString()
        }
      })
    )
  }, [])

  // Batch actions
  const toggleSelectTask = useCallback((id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }, [])

  const selectAllVisible = useCallback((ids) => {
    setSelectedTaskIds(ids)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([])
  }, [])

  const batchComplete = useCallback(() => {
    if (selectedTaskIds.length === 0) return
    setTasks((prev) =>
      prev.map((t) => {
        if (selectedTaskIds.includes(t.id)) {
          return {
            ...t,
            completed: true,
            status: 'completed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    )
    playComplete()
    showToast(`Marked ${selectedTaskIds.length} tasks as complete`, { type: 'success' })
    setSelectedTaskIds([])
  }, [selectedTaskIds, playComplete, showToast])

  const batchDelete = useCallback(() => {
    if (selectedTaskIds.length === 0) return
    const count = selectedTaskIds.length
    const deletedList = tasks.filter((t) => selectedTaskIds.includes(t.id))
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)))
    setSelectedTaskIds([])

    showToast(`Deleted ${count} tasks`, {
      type: 'warning',
      actionText: 'Undo',
      onAction: () => {
        setTasks((prev) => [...deletedList, ...prev])
        showToast(`Restored ${count} tasks`, { type: 'info' })
      }
    })
  }, [selectedTaskIds, tasks, showToast])

  // Category helpers
  const addCategory = useCallback((cat) => {
    const newCat = {
      id: cat.name.toLowerCase().replace(/\s+/g, '-'),
      name: cat.name.trim(),
      color: cat.color || '#3b82f6',
      icon: cat.icon || 'Folder'
    }
    setCategories((prev) => [...prev, newCat])
    showToast(`Created category "${newCat.name}"`, { type: 'success' })
  }, [showToast])

  const deleteCategory = useCallback((categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    showToast('Category deleted', { type: 'info' })
  }, [showToast])

  // Pomodoro
  const incrementPomodoro = useCallback((taskId) => {
    if (!taskId) return
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            completedPomodoros: (t.completedPomodoros || 0) + 1,
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    )
  }, [])

  // Sample data & reset
  const loadDemoData = useCallback(() => {
    const demo = generateSampleTasks()
    setTasks(demo)
    setCategories(DEFAULT_CATEGORIES)
    showToast('Loaded demo tasks & workspace templates', { type: 'info' })
  }, [showToast])

  const clearAllTasks = useCallback(() => {
    setTasks([])
    setSelectedTaskIds([])
    showToast('Cleared all tasks', { type: 'info' })
  }, [showToast])

  const importData = useCallback((importedTasks, importedCategories) => {
    if (Array.isArray(importedTasks) && importedTasks.length > 0) {
      setTasks(importedTasks)
    }
    if (Array.isArray(importedCategories) && importedCategories.length > 0) {
      setCategories(importedCategories)
    }
    showToast(`Imported ${importedTasks.length} tasks successfully`, { type: 'success' })
  }, [showToast])

  // Filtered & Sorted Tasks memo
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = task.title.toLowerCase().includes(q)
          const matchDesc = (task.description || '').toLowerCase().includes(q)
          const matchTags = (task.tags || []).some((tag) => tag.toLowerCase().includes(q))
          if (!matchTitle && !matchDesc && !matchTags) return false
        }

        // Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
          return false
        }

        // Active sidebar / main filter
        if (activeFilter === 'all') {
          return true
        }
        if (activeFilter === 'today') {
          return isToday(task.dueDate) || (isOverdue(task.dueDate, task.completed) && !task.completed)
        }
        if (activeFilter === 'upcoming') {
          return isUpcoming(task.dueDate) || Boolean(task.dueDate && !task.completed && !isToday(task.dueDate) && !isOverdue(task.dueDate))
        }
        if (activeFilter === 'important') {
          return task.priority === 'urgent' || task.priority === 'high' || task.isPinned
        }
        if (activeFilter === 'completed') {
          return task.completed
        }
        if (activeFilter === 'energy:high') {
          return !task.completed && (task.energyLevel === 'high' || task.priority === 'urgent')
        }
        if (activeFilter === 'energy:low') {
          return !task.completed && (task.energyLevel === 'low' || (task.estimatedPomodoros <= 1 && task.priority !== 'urgent'))
        }
        if (activeFilter.startsWith('cat:')) {
          const catId = activeFilter.replace('cat:', '')
          return task.category === catId
        }
        if (activeFilter.startsWith('tag:')) {
          const tagName = activeFilter.replace('tag:', '')
          return (task.tags || []).includes(tagName)
        }

        return true
      })
      .sort((a, b) => {
        // Pinned tasks always on top (except when completed)
        if (a.isPinned !== b.isPinned) {
          if (a.isPinned && !a.completed) return -1
          if (b.isPinned && !b.completed) return 1
        }

        // Completed tasks push down in general list
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1
        }

        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        }
        if (sortBy === 'priority') {
          const weight = { urgent: 4, high: 3, medium: 2, low: 1 }
          return (weight[b.priority] || 0) - (weight[a.priority] || 0)
        }
        if (sortBy === 'created') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [tasks, searchQuery, selectedPriority, activeFilter, sortBy])

  // Aggregate stats
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length
    const dueToday = tasks.filter((t) => isToday(t.dueDate) && !t.completed).length
    const urgent = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && !t.completed).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, overdue, dueToday, urgent, completionRate }
  }, [tasks])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        activeView,
        setActiveView,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        selectedPriority,
        setSelectedPriority,
        sortBy,
        setSortBy,
        selectedTaskIds,
        toggleSelectTask,
        selectAllVisible,
        clearSelection,
        modalTask,
        setModalTask,
        pomodoroTask,
        setPomodoroTask,
        isPomodoroOpen,
        setIsPomodoroOpen,
        toasts,
        showToast,
        removeToast,
        triggerConfetti,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        batchComplete,
        batchDelete,
        addCategory,
        deleteCategory,
        incrementPomodoro,
        loadDemoData,
        clearAllTasks,
        importData,
        filteredTasks,
        stats
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
