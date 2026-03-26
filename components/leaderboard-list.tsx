import { Award, Crown, Medal } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/types'

interface LeaderboardListProps {
  entries: LeaderboardEntry[]
  emptyMessage?: string
}

function getPositionIcon(position: number) {
  switch (position) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-300" />
    case 2:
      return <Medal className="h-6 w-6 text-slate-300" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-xl font-bold text-muted-foreground">{position}</span>
  }
}

export function LeaderboardList({ entries, emptyMessage = 'Aun no hay tiempos cargados.' }: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/50">
            {getPositionIcon(entry.position)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-foreground">{entry.name}</h3>
            <p className="truncate text-sm text-muted-foreground">
              {entry.wpm} WPM • {entry.errors} errores
            </p>
          </div>
          <div className="font-mono text-xl font-bold text-primary">{entry.timeSeconds.toFixed(2)}s</div>
        </div>
      ))}
    </div>
  )
}