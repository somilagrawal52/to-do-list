/**
 * Centralized Task Domain Constants & Configurations
 */

export const PRIORITIES = {
  urgent: {
    id: 'urgent',
    label: 'Urgent',
    emojiLabel: '🔴 Urgent Priority',
    color: 'bg-rose-500',
    dotColor: 'bg-rose-500',
    badgeClasses: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
    weight: 4
  },
  high: {
    id: 'high',
    label: 'High',
    emojiLabel: '🟠 High Priority',
    color: 'bg-amber-500',
    dotColor: 'bg-amber-500',
    badgeClasses: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
    weight: 3
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    emojiLabel: '🔵 Medium Priority',
    color: 'bg-blue-500',
    dotColor: 'bg-blue-500',
    badgeClasses: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60',
    weight: 2
  },
  low: {
    id: 'low',
    label: 'Low',
    emojiLabel: '⚪ Low Priority',
    color: 'bg-slate-400',
    dotColor: 'bg-slate-400',
    badgeClasses: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
    weight: 1
  }
}

export const PRIORITY_LIST = Object.values(PRIORITIES)

export const STATUSES = {
  todo: { id: 'todo', label: 'To Do' },
  'in-progress': { id: 'in-progress', label: 'In Progress' },
  review: { id: 'review', label: 'In Review' },
  completed: { id: 'completed', label: 'Completed' }
}

export const STATUS_LIST = Object.values(STATUSES)

export const ENERGY_LEVELS = {
  high: {
    id: 'high',
    label: 'Deep Work',
    emojiLabel: '⚡ Deep Work',
    badgeClasses: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50'
  },
  medium: {
    id: 'medium',
    label: 'Balanced',
    emojiLabel: '🌱 Balanced',
    badgeClasses: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50'
  },
  low: {
    id: 'low',
    label: 'Quick Win',
    emojiLabel: '☕ Quick Win',
    badgeClasses: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50'
  }
}

export const ENERGY_LIST = Object.values(ENERGY_LEVELS)
