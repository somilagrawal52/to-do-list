// Export and Import utilities for tasks and settings

// Neutralize CSV formula injection (CWE-1236)
function sanitizeCsvValue(val) {
  if (val === null || val === undefined) return ''
  let str = String(val)
  // If value starts with formula triggers (=, +, -, @, tab, cr), escape with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str
  }
  return str.replace(/"/g, '""').replace(/\r?\n/g, ' ')
}

export function exportToJson(tasks, categories) {
  const payload = {
    app: 'TaskFlow Studio',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    taskCount: tasks.length,
    categories,
    tasks
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8;'
  })
  const url = URL.createObjectURL(blob)
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', url)
  downloadAnchor.setAttribute(
    'download',
    `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`
  )
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportToCsv(tasks) {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Category',
    'Due Date',
    'Due Time',
    'Completed',
    'Tags',
    'Subtask Count',
    'Subtasks Done',
    'Energy Level',
    'Created At'
  ]

  const rows = tasks.map((t) => {
    const subtasksDone = (t.subtasks || []).filter((s) => s.completed).length
    const totalSubtasks = (t.subtasks || []).length
    const cleanDesc = sanitizeCsvValue(t.description || '')
    const cleanTitle = sanitizeCsvValue(t.title || '')
    const tagsStr = sanitizeCsvValue((t.tags || []).join(';'))

    return [
      `"${sanitizeCsvValue(t.id)}"`,
      `"${cleanTitle}"`,
      `"${cleanDesc}"`,
      `"${sanitizeCsvValue(t.status || 'todo')}"`,
      `"${sanitizeCsvValue(t.priority || 'medium')}"`,
      `"${sanitizeCsvValue(t.category || '')}"`,
      `"${sanitizeCsvValue(t.dueDate || '')}"`,
      `"${sanitizeCsvValue(t.dueTime || '')}"`,
      `"${t.completed ? 'Yes' : 'No'}"`,
      `"${tagsStr}"`,
      totalSubtasks,
      subtasksDone,
      `"${sanitizeCsvValue(t.energyLevel || 'medium')}"`,
      `"${sanitizeCsvValue(t.createdAt || '')}"`
    ].join(',')
  })

  // Prepend UTF-8 BOM so Excel opens UTF-8 characters without encoding errors
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', url)
  downloadAnchor.setAttribute(
    'download',
    `taskflow-export-${new Date().toISOString().slice(0, 10)}.csv`
  )
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Sanitize imported tasks to guarantee complete schema stability
export function sanitizeTask(task) {
  return {
    id: String(task.id || 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)),
    title: String(task.title || 'Untitled Task').trim(),
    description: String(task.description || ''),
    completed: Boolean(task.completed),
    completedAt: task.completedAt || (task.completed ? new Date().toISOString() : null),
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
    priority: ['urgent', 'high', 'medium', 'low'].includes(task.priority) ? task.priority : 'medium',
    dueDate: typeof task.dueDate === 'string' ? task.dueDate.slice(0, 10) : '',
    dueTime: typeof task.dueTime === 'string' ? task.dueTime.slice(0, 5) : '',
    category: String(task.category || 'work'),
    tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
    status: ['todo', 'in-progress', 'review', 'completed'].includes(task.status)
      ? task.status
      : task.completed
      ? 'completed'
      : 'todo',
    isPinned: Boolean(task.isPinned),
    estimatedPomodoros: Math.max(1, Math.min(20, Number(task.estimatedPomodoros) || 1)),
    completedPomodoros: Math.max(0, Number(task.completedPomodoros) || 0),
    energyLevel: ['high', 'medium', 'low'].includes(task.energyLevel) ? task.energyLevel : 'medium',
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map((s, idx) => ({
          id: String(s.id || `sub-${idx}-${Date.now()}`),
          title: String(s.title || 'Subtask').trim(),
          completed: Boolean(s.completed)
        }))
      : []
  }
}

export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (!parsed || (!Array.isArray(parsed) && !Array.isArray(parsed.tasks))) {
          throw new Error('Invalid format: Could not find tasks array.')
        }
        const rawTasks = Array.isArray(parsed) ? parsed : parsed.tasks
        const tasks = rawTasks.map(sanitizeTask)
        const categories = Array.isArray(parsed.categories) ? parsed.categories : []
        resolve({ tasks, categories })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
