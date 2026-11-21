import { useState, useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import {
  Plus,
  Trash2,
  Pin,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react'
import Modal from './common/Modal'
import { PRIORITIES, PRIORITY_LIST, STATUS_LIST, ENERGY_LIST } from '../constants/taskConstants'

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function TaskDetailModal() {
  const { modalTask, setModalTask, addTask, updateTask, deleteTask, categories } = useTasks()

  const isNew = modalTask === 'new'
  const isEditing = Boolean(modalTask && modalTask !== 'new')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [category, setCategory] = useState('work')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)
  const [energyLevel, setEnergyLevel] = useState('medium')
  const [subtasks, setSubtasks] = useState([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [tags, setTags] = useState([])
  const [newTagInput, setNewTagInput] = useState('')

  useEffect(() => {
    if (isEditing && typeof modalTask === 'object') {
      setTitle(modalTask.title || '')
      setDescription(modalTask.description || '')
      setPriority(modalTask.priority || 'medium')
      setStatus(modalTask.status || (modalTask.completed ? 'completed' : 'todo'))
      setCategory(modalTask.category || (categories[0]?.id ?? 'work'))
      setDueDate(modalTask.dueDate || '')
      setDueTime(modalTask.dueTime || '')
      setIsPinned(Boolean(modalTask.isPinned))
      setEstimatedPomodoros(modalTask.estimatedPomodoros || 1)
      setEnergyLevel(modalTask.energyLevel || 'medium')
      setSubtasks(modalTask.subtasks || [])
      setTags(modalTask.tags || [])
    } else if (isNew) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('todo')
      setCategory(categories[0]?.id || 'work')
      setDueDate('')
      setDueTime('')
      setIsPinned(false)
      setEstimatedPomodoros(1)
      setEnergyLevel('medium')
      setSubtasks([])
      setTags([])
    }
  }, [modalTask, isEditing, isNew, categories])

  if (!modalTask) return null

  const handleClose = () => setModalTask(null)

  const handleSave = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      dueDate,
      dueTime,
      isPinned,
      estimatedPomodoros: Number(estimatedPomodoros) || 1,
      energyLevel,
      subtasks,
      tags
    }

    if (isEditing) {
      updateTask(modalTask.id, payload)
    } else {
      addTask(payload)
    }
    handleClose()
  }

  const handleDelete = () => {
    if (isEditing) {
      deleteTask(modalTask.id)
      handleClose()
    }
  }

  // Subtask helpers
  const handleAddSubtask = (e) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    setSubtasks((prev) => [
      ...prev,
      {
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title: newSubtaskTitle.trim(),
        completed: false
      }
    ])
    setNewSubtaskTitle('')
  }

  const handleToggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id))
  }

  // Tag helpers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = newTagInput.trim().replace(/^#/, '')
      if (clean && !tags.includes(clean)) {
        setTags((prev) => [...prev, clean])
      }
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const currentPriorityObj = PRIORITIES[priority] || PRIORITIES.medium

  return (
    <Modal
      isOpen={Boolean(modalTask)}
      onClose={handleClose}
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${currentPriorityObj.dotColor}`} />
          <span>{isNew ? 'Create New Task' : 'Edit Task Details'}</span>
        </div>
      }
      headerRight={
        <button
          type="button"
          onClick={() => setIsPinned(!isPinned)}
          title={isPinned ? 'Unpin task' : 'Pin task to top'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isPinned
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Pin className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`} />
        </button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        <FormField label="Task Title" required>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Conduct user feedback research session"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-base font-medium transition-all"
          />
        </FormField>

        <FormField label="Notes & Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add extra context, links, or criteria for completion..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm transition-all resize-none"
          />
        </FormField>

        {/* Meta Grid: Priority, Category, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {PRIORITY_LIST.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.emojiLabel}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_LIST.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Due Date & Time, Pomodoro & Energy Level */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <FormField label="Due Date">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </FormField>

          <FormField label="Due Time">
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </FormField>

          <FormField label="Pomodoros (25m)">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="20"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            </div>
          </FormField>

          <FormField label="Energy Level">
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {ENERGY_LIST.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.emojiLabel}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Subtasks Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subtasks / Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 group"
                >
                  <div
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    {sub.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        sub.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a step or subtask..."
              className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3.5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <FormField label="Tags">
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-indigo-900 dark:hover:text-white cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter..."
              className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden min-w-[140px]"
            />
          </div>
        </FormField>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Task</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
            >
              {isNew ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
