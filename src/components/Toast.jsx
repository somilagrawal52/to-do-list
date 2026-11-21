import { useTasks } from '../context/TaskContext'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'

export default function Toast() {
  const { toasts, removeToast } = useTasks()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info
        let colorClasses = 'bg-slate-900 text-white dark:bg-slate-800 border-slate-700'

        if (toast.type === 'success') {
          Icon = CheckCircle2
          colorClasses = 'bg-slate-900 dark:bg-slate-800 text-white border-emerald-500/30'
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle
          colorClasses = 'bg-slate-900 dark:bg-slate-800 text-white border-amber-500/30'
        } else if (toast.type === 'error') {
          Icon = XCircle
          colorClasses = 'bg-slate-900 dark:bg-slate-800 text-white border-rose-500/30'
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-5 ${colorClasses}`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  toast.type === 'success'
                    ? 'text-emerald-400'
                    : toast.type === 'warning'
                    ? 'text-amber-400'
                    : toast.type === 'error'
                    ? 'text-rose-400'
                    : 'text-indigo-400'
                }`}
              />
              <span className="text-sm font-medium leading-snug break-words">
                {toast.message}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionText && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction()
                    removeToast(toast.id)
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {toast.actionText}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded-md"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
