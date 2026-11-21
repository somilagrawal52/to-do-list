import { useState, useRef } from 'react'
import { useTasks } from '../context/TaskContext'
import { exportToJson, exportToCsv, parseImportFile } from '../utils/exportUtils'
import {
  Upload,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  Trash2,
  Database
} from 'lucide-react'
import Modal from './common/Modal'

export default function ExportImportModal({ isOpen, onClose }) {
  const { tasks, categories, importData, loadDemoData, clearAllTasks, showToast } = useTasks()
  const [importMode, setImportMode] = useState('merge') // 'merge' | 'replace'
  const [confirmClear, setConfirmClear] = useState(false)
  const fileInputRef = useRef(null)

  const handleJsonExport = () => {
    exportToJson(tasks, categories)
    showToast('Exported tasks to JSON', { type: 'success' })
  }

  const handleCsvExport = () => {
    exportToCsv(tasks)
    showToast('Exported tasks to CSV', { type: 'success' })
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { tasks: importedTasks, categories: importedCats } = await parseImportFile(file)
      if (importMode === 'replace') {
        importData(importedTasks, importedCats)
      } else {
        const existingIds = new Set(tasks.map((t) => t.id))
        const newTasks = importedTasks.filter((t) => !existingIds.has(t.id))
        importData([...tasks, ...newTasks], categories)
      }
      onClose()
    } catch (err) {
      showToast(`Import error: ${err.message}`, { type: 'error' })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title="Data Management & Backup"
      subtitle="Export backups, import JSON files, or manage workspace data"
      icon={Database}
    >
      <div className="space-y-6">
        {/* Export Section */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Export Your Data
          </label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={handleJsonExport}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all cursor-pointer"
            >
              <FileJson className="w-5 h-5 text-indigo-500" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handleCsvExport}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Import from Backup
          </label>
          <div className="mt-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="taskflow-file-import"
            />
            <div className="flex justify-center gap-4 mb-3 text-xs font-medium text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-indigo-600"
                />
                <span>Merge with existing</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-indigo-600"
                />
                <span>Replace existing tasks</span>
              </label>
            </div>
            <label
              htmlFor="taskflow-file-import"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Select JSON Backup File</span>
            </label>
          </div>
        </div>

        {/* Templates & Reset */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                loadDemoData()
                onClose()
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load Demo Tasks</span>
            </button>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Workspace Data</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearAllTasks()
                    setConfirmClear(false)
                    onClose()
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Wipe
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
