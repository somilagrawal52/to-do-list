import { PRIORITIES, ENERGY_LEVELS } from '../../constants/taskConstants'

export function PriorityBadge({ priority, className = '' }) {
  const prio = PRIORITIES[priority] || PRIORITIES.medium
  return (
    <span
      className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${prio.badgeClasses} ${className}`}
    >
      {prio.label}
    </span>
  )
}

export function CategoryBadge({ categoryId, categories = [], className = '' }) {
  const catObj = categories.find((c) => c.id === categoryId) || {
    name: 'General',
    color: '#6366f1'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: catObj.color }}
      />
      {catObj.name}
    </span>
  )
}

export function EnergyBadge({ energyLevel, className = '' }) {
  const energy = ENERGY_LEVELS[energyLevel]
  if (!energy || energyLevel === 'medium') return null

  return (
    <span
      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${energy.badgeClasses} ${className}`}
    >
      {energy.emojiLabel}
    </span>
  )
}
