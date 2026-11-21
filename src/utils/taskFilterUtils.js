import { isToday, isOverdue, isUpcoming } from './dateUtils'
import { PRIORITIES } from '../constants/taskConstants'

/**
 * Filter and sort a collection of tasks based on UI criteria
 */
export function filterAndSortTasks(tasks, { searchQuery = '', selectedPriority = 'all', activeFilter = 'all', sortBy = 'dueDate' } = {}) {
  const query = searchQuery.trim().toLowerCase()

  return tasks
    .filter((task) => {
      // 1. Search Query Filter
      if (query) {
        const matchTitle = (task.title || '').toLowerCase().includes(query)
        const matchDesc = (task.description || '').toLowerCase().includes(query)
        const matchTags = Array.isArray(task.tags) && task.tags.some((tag) => (tag || '').toLowerCase().includes(query))
        if (!matchTitle && !matchDesc && !matchTags) return false
      }

      // 2. Explicit Priority Filter Dropdown
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false
      }

      // 3. Active Sidebar / Navigation Filter
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

      // Completed tasks push down in general view
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortBy === 'priority') {
        return (PRIORITIES[b.priority]?.weight || 0) - (PRIORITIES[a.priority]?.weight || 0)
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      }
      return 0
    })
}

/**
 * Compute aggregate statistics for the task dashboard
 */
export function computeTaskStats(tasks = []) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length
  const dueToday = tasks.filter((t) => isToday(t.dueDate) && !t.completed).length
  const urgent = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && !t.completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, overdue, dueToday, urgent, completionRate }
}
