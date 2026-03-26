export interface ParticipantDraft {
  id: string
  name: string
  text: string
  timeSeconds: number | null
  errors: number
  wpm: number
  completed: boolean
  createdAt: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  text: string
  socialHandle?: string
  timeSeconds: number
  errors: number
  wpm: number
  createdAt: string
  position: number
}

export interface SessionSummary {
  id: string
  slug: string
  name: string
  location: string
  eventDate: string
  status: 'draft' | 'active' | 'closed'
  isActive: boolean
  participantCount: number
  publicPath: string
}