// Safe localStorage wrapper with versioned storage schema and error fallbacks

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v2',
  CATEGORIES: 'taskflow_categories_v2',
  SETTINGS: 'taskflow_settings_v2',
  STATS: 'taskflow_stats_v2'
}

export function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage:`, err)
    return defaultValue
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Failed saving ${key} to localStorage:`, err)
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error(`Failed removing ${key} from localStorage:`, err)
  }
}

export { STORAGE_KEYS }
