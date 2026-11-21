// Export and Import utilities for tasks and settings

export function exportToJson(tasks, categories) {
  const payload = {
    app: 'TaskFlow Studio',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    taskCount: tasks.length,
    categories,
    tasks
  }

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(payload, null, 2)
  )}`
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', jsonString)
  downloadAnchor.setAttribute(
    'download',
    `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`
  )
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
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
    'Created At'
  ]

  const rows = tasks.map((t) => {
    const subtasksDone = (t.subtasks || []).filter((s) => s.completed).length
    const totalSubtasks = (t.subtasks || []).length
    const cleanDesc = (t.description || '').replace(/"/g, '""').replace(/\n/g, ' ')
    const cleanTitle = (t.title || '').replace(/"/g, '""')
    const tagsStr = (t.tags || []).join(';')

    return [
      `"${t.id}"`,
      `"${cleanTitle}"`,
      `"${cleanDesc}"`,
      `"${t.status || 'todo'}"`,
      `"${t.priority || 'medium'}"`,
      `"${t.category || ''}"`,
      `"${t.dueDate || ''}"`,
      `"${t.dueTime || ''}"`,
      `"${t.completed ? 'Yes' : 'No'}"`,
      `"${tagsStr}"`,
      totalSubtasks,
      subtasksDone,
      `"${t.createdAt || ''}"`
    ].join(',')
  })

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
  const encodedUri = encodeURI(csvContent)
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', encodedUri)
  downloadAnchor.setAttribute(
    'download',
    `taskflow-export-${new Date().toISOString().slice(0, 10)}.csv`
  )
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
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
        const tasks = Array.isArray(parsed) ? parsed : parsed.tasks
        const categories = parsed.categories || []
        resolve({ tasks, categories })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
