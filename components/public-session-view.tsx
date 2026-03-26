'use client'

import { useMemo, useState } from 'react'
import { Search, Trophy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LeaderboardList } from '@/components/leaderboard-list'
import type { LeaderboardEntry, SessionSummary } from '@/lib/types'

interface PublicSessionViewProps {
  session: SessionSummary
  leaderboard: LeaderboardEntry[]
}

export function PublicSessionView({ session, leaderboard }: PublicSessionViewProps) {
  const [query, setQuery] = useState('')

  const filteredLeaderboard = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return leaderboard
    }

    return leaderboard.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery))
  }, [leaderboard, query])

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card/75 p-6">
          <div className="mb-3 flex items-center gap-3 text-primary">
            <Trophy className="h-8 w-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Clasificacion publica</p>
              <h1 className="text-3xl font-bold text-foreground">{session.name}</h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            {session.location} • {session.eventDate}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Ordenado por menor tiempo. Esta vista no permite iniciar turnos ni registrar participantes.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/75 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre"
              className="h-12 pl-11"
            />
          </div>
        </div>

        <LeaderboardList entries={filteredLeaderboard} emptyMessage="No se encontraron participantes para esta busqueda." />
      </div>
    </div>
  )
}