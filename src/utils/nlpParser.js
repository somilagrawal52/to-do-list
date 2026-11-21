import { getTodayString, getTomorrowString, getDateOffset } from './dateUtils'

export function parseNaturalLanguageTask(input, existingCategories = []) {
  if (!input || !input.trim()) {
    return {
      raw: input,
      cleanTitle: '',
      dueDate: '',
      dueTime: '',
      priority: null,
      category: null,
      estimatedPomodoros: null,
      tags: [],
      energyLevel: null,
      detectedEntities: []
    }
  }

  let text = input
  const detectedEntities = []
  let dueDate = ''
  let dueTime = ''
  let priority = null
  let category = null
  let estimatedPomodoros = null
  let energyLevel = null
  const tags = []

  // 1. Detect Priority (!urgent, !high, !med, !low, p1, p2, p3, p4)
  const priorityRegex = /\b(!urgent|!high|!medium|!med|!low|p1|p2|p3|p4)\b/i
  const prioMatch = text.match(priorityRegex)
  if (prioMatch) {
    const rawPrio = prioMatch[1].toLowerCase()
    if (rawPrio === '!urgent' || rawPrio === 'p1') {
      priority = 'urgent'
      detectedEntities.push({ type: 'priority', label: '🔴 Urgent Priority', value: 'urgent' })
    } else if (rawPrio === '!high' || rawPrio === 'p2') {
      priority = 'high'
      detectedEntities.push({ type: 'priority', label: '🟠 High Priority', value: 'high' })
    } else if (rawPrio === '!medium' || rawPrio === '!med' || rawPrio === 'p3') {
      priority = 'medium'
      detectedEntities.push({ type: 'priority', label: '🔵 Medium Priority', value: 'medium' })
    } else if (rawPrio === '!low' || rawPrio === 'p4') {
      priority = 'low'
      detectedEntities.push({ type: 'priority', label: '⚪ Low Priority', value: 'low' })
    }
    text = text.replace(prioMatch[0], ' ')
  }

  // 2. Detect Pomodoros (@2p, @3pomodoros, @4pomo)
  const pomoRegex = /@(\d+)\s*(p|pomo|pomodoros)?\b/i
  const pomoMatch = text.match(pomoRegex)
  if (pomoMatch) {
    const count = parseInt(pomoMatch[1], 10)
    if (!isNaN(count) && count > 0) {
      estimatedPomodoros = count
      detectedEntities.push({ type: 'pomo', label: `🔥 ${count} Pomodoros`, value: count })
      text = text.replace(pomoMatch[0], ' ')
    }
  }

  // 3. Detect Energy Level (~deep, ~high, ~quick, ~low)
  const energyRegex = /~(deep|high|quick|low|medium|routine)\b/i
  const energyMatch = text.match(energyRegex)
  if (energyMatch) {
    const val = energyMatch[1].toLowerCase()
    if (val === 'deep' || val === 'high') {
      energyLevel = 'high'
      detectedEntities.push({ type: 'energy', label: '⚡ Deep Work', value: 'high' })
    } else if (val === 'quick' || val === 'low') {
      energyLevel = 'low'
      detectedEntities.push({ type: 'energy', label: '☕ Quick Win', value: 'low' })
    } else {
      energyLevel = 'medium'
      detectedEntities.push({ type: 'energy', label: '🌱 Normal Focus', value: 'medium' })
    }
    text = text.replace(energyMatch[0], ' ')
  }

  // 4. Detect Categories and Tags (#category, #tag)
  // Safely find all matches first without mutating the string during matching
  const catMatches = Array.from(text.matchAll(/#([a-zA-Z0-9_-]+)/g))
  for (const match of catMatches) {
    const rawTag = match[1]
    const catName = rawTag.toLowerCase()
    const foundCat = existingCategories.find(
      (c) => c.id.toLowerCase() === catName || c.name.toLowerCase().includes(catName)
    )
    if (foundCat && !category) {
      category = foundCat.id
      detectedEntities.push({ type: 'category', label: `📁 ${foundCat.name}`, value: foundCat.id })
    } else if (!tags.includes(rawTag)) {
      tags.push(rawTag)
      detectedEntities.push({ type: 'tag', label: `#${rawTag}`, value: rawTag })
    }
    text = text.replace(match[0], ' ')
  }

  // 5. Detect Date keywords (today, tomorrow, tonight, in X days, next monday, etc.)
  const today = getTodayString()
  const tomorrow = getTomorrowString()

  const dateKeywords = [
    { regex: /\b(today|tonight)\b/i, date: today, label: '📅 Today' },
    { regex: /\b(tomorrow|tmrw)\b/i, date: tomorrow, label: '🌅 Tomorrow' },
    { regex: /\bin 2 days\b/i, date: getDateOffset(2), label: '🗓️ In 2 days' },
    { regex: /\bin 3 days\b/i, date: getDateOffset(3), label: '🗓️ In 3 days' },
    { regex: /\bin a week\b/i, date: getDateOffset(7), label: '🗓️ In a week' },
    { regex: /\bnext week\b/i, date: getDateOffset(7), label: '🗓️ Next week' }
  ]

  for (const item of dateKeywords) {
    if (item.regex.test(text)) {
      dueDate = item.date
      detectedEntities.push({ type: 'date', label: item.label, value: item.date })
      text = text.replace(item.regex, ' ')
      break
    }
  }

  // Day of week matching (e.g. "on friday", "next monday", "this saturday")
  if (!dueDate) {
    const dayRegex = /\b(next|this|on)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    const dayMatch = text.match(dayRegex)
    if (dayMatch) {
      const dayName = dayMatch[2].toLowerCase()
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDay = daysOfWeek.indexOf(dayName)
      if (targetDay !== -1) {
        const d = new Date()
        const currentDay = d.getDay()
        let diff = targetDay - currentDay
        if (diff <= 0) diff += 7
        const calcDate = getDateOffset(diff)
        dueDate = calcDate
        detectedEntities.push({
          type: 'date',
          label: `📅 ${dayMatch[2].charAt(0).toUpperCase() + dayMatch[2].slice(1)}`,
          value: calcDate
        })
        text = text.replace(dayMatch[0], ' ')
      }
    }
  }

  // 6. Detect Time keywords (at 3pm, at 5:30pm, 14:00, 9am)
  const timeRegex = /\b(at\s+)?(\d{1,2})(:\d{2})?\s*(am|pm)\b/i
  const timeMatch = text.match(timeRegex)
  if (timeMatch) {
    let hour = parseInt(timeMatch[2], 10)
    const minutes = timeMatch[3] ? timeMatch[3].replace(':', '') : '00'
    const meridiem = timeMatch[4].toLowerCase()

    if (meridiem === 'pm' && hour < 12) hour += 12
    if (meridiem === 'am' && hour === 12) hour = 0

    const formattedTime = `${String(hour).padStart(2, '0')}:${minutes}`
    dueTime = formattedTime
    detectedEntities.push({ type: 'time', label: `⏰ ${timeMatch[0].trim()}`, value: formattedTime })
    text = text.replace(timeMatch[0], ' ')
  }

  // Clean remaining text
  const cleanTitle = text.replace(/\s+/g, ' ').trim()

  return {
    cleanTitle: cleanTitle || input.trim(),
    dueDate,
    dueTime,
    priority,
    category,
    estimatedPomodoros,
    tags,
    energyLevel,
    detectedEntities
  }
}
