// Safe localStorage wrapper with versioned storage schema, memory fallback, and quota handling

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v2',
  CATEGORIES: 'taskflow_categories_v2',
  SETTINGS: 'taskflow_settings_v2',
  STATS: 'taskflow_stats_v2'
}

// In-memory fallback if localStorage is blocked by user privacy settings or SSR
const memoryCache = new Map()

function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    const testKey = '__tf_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

const hasLocalStorage = isLocalStorageAvailable()

export function loadFromStorage(key, defaultValue) {
  try {
    if (hasLocalStorage) {
      const raw = window.localStorage.getItem(key)
      if (raw !== null && raw !== undefined) {
        return JSON.parse(raw)
      }
    } else if (memoryCache.has(key)) {
      return memoryCache.get(key)
    }
    return defaultValue
  } catch (err) {
    console.warn(`Failed reading ${key} from storage:`, err)
    return defaultValue
  }
}

export function saveToStorage(key, value) {
  try {
    if (hasLocalStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
    } else {
      memoryCache.set(key, value)
    }
  } catch (err) {
    console.warn(`Failed saving ${key} to localStorage (falling back to memory):`, err)
    memoryCache.set(key, value)
  }
}

export function removeFromStorage(key) {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key)
    }
    memoryCache.delete(key)
  } catch (err) {
    console.warn(`Failed removing ${key} from storage:`, err)
  }
}

export { STORAGE_KEYS }
