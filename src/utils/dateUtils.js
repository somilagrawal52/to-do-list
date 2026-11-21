// Date and time utility functions for TaskFlow

export function getTodayString() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTomorrowString() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDateOffset(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isToday(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  return dateStr.slice(0, 10) === getTodayString()
}

export function isTomorrow(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  return dateStr.slice(0, 10) === getTomorrowString()
}

export function isOverdue(dateStr, completed = false) {
  if (!dateStr || completed || typeof dateStr !== 'string') return false
  const today = getTodayString()
  return dateStr.slice(0, 10) < today
}

export function isUpcoming(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  const today = getTodayString()
  return dateStr.slice(0, 10) > today
}

export function isThisWeek(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  const parts = dateStr.slice(0, 10).split('-')
  if (parts.length !== 3) return false
  const target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  if (isNaN(target.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
  return target >= today && target <= endOfWeek
}

export function formatFriendlyDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const cleanDate = dateStr.slice(0, 10)
  if (isToday(cleanDate)) return 'Today'
  if (isTomorrow(cleanDate)) return 'Tomorrow'
  
  const yesterday = getDateOffset(-1)
  if (cleanDate === yesterday) return 'Yesterday'

  const parts = cleanDate.split('-')
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    if (isNaN(d.getTime())) return dateStr
    const currentYear = new Date().getFullYear()
    const options = { month: 'short', day: 'numeric' }
    if (d.getFullYear() !== currentYear) {
      options.year = 'numeric'
    }
    return d.toLocaleDateString(undefined, options)
  }
  return dateStr
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return ''
  const past = new Date(timestamp).getTime()
  if (isNaN(past)) return ''
  const now = Date.now()
  const diffSec = Math.floor((now - past) / 1000)

  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
