import { getTodayString, getTomorrowString, getDateOffset } from './dateUtils'

export const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work & Career', color: '#3b82f6', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal & Life', color: '#8b5cf6', icon: 'User' },
  { id: 'engineering', name: 'Engineering', color: '#10b981', icon: 'Code' },
  { id: 'health', name: 'Health & Fitness', color: '#ec4899', icon: 'Heart' },
  { id: 'finance', name: 'Finance & Admin', color: '#f59e0b', icon: 'DollarSign' }
]

export const generateSampleTasks = () => {
  const today = getTodayString()
  const tomorrow = getTomorrowString()
  const inThreeDays = getDateOffset(3)
  const inFiveDays = getDateOffset(5)
  const yesterday = getDateOffset(-1)

  return [
    {
      id: 'task-1',
      title: 'Finalize Q4 Product Roadmap & Feature Specs',
      description: 'Review KPIs, user feedback tickets, and finalize milestone deliverables with engineering leads.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      priority: 'urgent',
      dueDate: today,
      dueTime: '15:00',
      category: 'work',
      tags: ['Strategy', 'Roadmap', 'Q4'],
      status: 'in-progress',
      isPinned: true,
      energyLevel: 'high',
      estimatedPomodoros: 4,
      completedPomodoros: 2,
      subtasks: [
        { id: 'sub-1', title: 'Synthesize customer interview feedback', completed: true },
        { id: 'sub-2', title: 'Prioritize P0 security and performance items', completed: true },
        { id: 'sub-3', title: 'Draft Executive Summary deck for stakeholders', completed: false },
        { id: 'sub-4', title: 'Confirm budget allocation with finance', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Deploy Production API & Health Check Monitors',
      description: 'Run deployment pipeline for v2.4.0, verify database migrations, and confirm APM latency alerts.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      priority: 'high',
      dueDate: today,
      dueTime: '18:30',
      category: 'engineering',
      tags: ['DevOps', 'Release', 'Backend'],
      status: 'todo',
      isPinned: true,
      energyLevel: 'high',
      estimatedPomodoros: 3,
      completedPomodoros: 0,
      subtasks: [
        { id: 'sub-21', title: 'Verify staging integration tests pass', completed: true },
        { id: 'sub-22', title: 'Execute zero-downtime DB migrations', completed: false },
        { id: 'sub-23', title: 'Smoke test user authentication and payments', completed: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Morning 5km Recovery Run & Core Workout',
      description: 'Keep zone 2 heart rate under 145 bpm, followed by 15 mins mobility stretches.',
      completed: true,
      completedAt: new Date(Date.now() - 14400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14400000).toISOString(),
      priority: 'medium',
      dueDate: today,
      dueTime: '07:30',
      category: 'health',
      tags: ['Fitness', 'Cardio'],
      status: 'completed',
      isPinned: false,
      energyLevel: 'low',
      estimatedPomodoros: 1,
      completedPomodoros: 1,
      subtasks: [
        { id: 'sub-31', title: '5km jog', completed: true },
        { id: 'sub-32', title: 'Core & mobility routine', completed: true }
      ]
    },
    {
      id: 'task-4',
      title: 'Prepare Tax Invoices & Expense Receipts',
      description: 'Download bank statements, organize software subscriptions, and submit receipts to the portal.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      priority: 'medium',
      dueDate: tomorrow,
      dueTime: '12:00',
      category: 'finance',
      tags: ['Accounting', 'Tax'],
      status: 'todo',
      isPinned: false,
      energyLevel: 'low',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      subtasks: [
        { id: 'sub-41', title: 'Export Stripe & PayPal merchant statements', completed: true },
        { id: 'sub-42', title: 'Tag business deductions in accounting app', completed: false },
        { id: 'sub-43', title: 'Send zip bundle to CPA', completed: false }
      ]
    },
    {
      id: 'task-5',
      title: 'Read 2 Chapters of "Designing Data-Intensive Applications"',
      description: 'Chapter 7: Transactions & Distributed Consensus guarantees.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      priority: 'low',
      dueDate: inThreeDays,
      dueTime: '21:00',
      category: 'personal',
      tags: ['Books', 'SelfImprovement'],
      status: 'todo',
      isPinned: false,
      energyLevel: 'low',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      subtasks: []
    },
    {
      id: 'task-6',
      title: 'Review System Architecture Design Doc for OAuth2 Migration',
      description: 'Evaluate PKCE flow, refresh token rotation strategy, and Redis session store sizing.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high',
      dueDate: inFiveDays,
      dueTime: '16:00',
      category: 'engineering',
      tags: ['Architecture', 'Security'],
      status: 'review',
      isPinned: false,
      estimatedPomodoros: 3,
      completedPomodoros: 1,
      subtasks: [
        { id: 'sub-61', title: 'Audit legacy session lifetime configuration', completed: true },
        { id: 'sub-62', title: 'Verify mobile app deep-linking redirect security', completed: false }
      ]
    },
    {
      id: 'task-7',
      title: 'Renew Passport & Schedule Visa Appointment',
      description: 'Ensure photo meets biometric passport standards and submit online application.',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      priority: 'urgent',
      dueDate: yesterday,
      dueTime: '11:00',
      category: 'personal',
      tags: ['Travel', 'Important'],
      status: 'todo',
      isPinned: false,
      energyLevel: 'low',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      subtasks: [
        { id: 'sub-71', title: 'Take compliant passport photograph', completed: true },
        { id: 'sub-72', title: 'Fill embassy application form', completed: false }
      ]
    }
  ]
}
