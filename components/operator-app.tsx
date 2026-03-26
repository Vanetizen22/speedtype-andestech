'use client'

import { useCallback, useState } from 'react'
import { Keyboard, Loader2, Play, RotateCcw, Share2, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { Leaderboard, type Participant } from '@/components/leaderboard'
import { ParticipantForm } from '@/components/participant-form'
import { TypingTest } from '@/components/typing-test'
import { Button } from '@/components/ui/button'
import { getTextByIndex } from '@/lib/texts'
import type { SessionSummary } from '@/lib/types'

interface OperatorAppProps {
  initialSession: SessionSummary | null
  initialParticipants: Participant[]
}

export function OperatorApp({ initialSession, initialParticipants }: OperatorAppProps) {
  const [session] = useState<SessionSummary | null>(initialSession)
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  const addParticipant = async (name: string) => {
    if (!session) {
      return
    }

    const text = getTextByIndex(participants.length)

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'No se pudo agregar el participante')
      }

      setParticipants((previous) => [...previous, data.participant])
      toast.success(`${name} agregado a la sesion`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar participante')
    }
  }

  const handleComplete = useCallback(
    async (time: number, errors: number, wpm: number) => {
      if (!currentPlayer) {
        return
      }

      try {
        const response = await fetch('/api/participants', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentPlayer, time_seconds: time, errors, wpm }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? 'No se pudo guardar resultado')
        }

        setParticipants((previous) =>
          previous.map((participant) =>
            participant.id === currentPlayer ? data.participant : participant
          )
        )

        toast.success('Resultado guardado')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al guardar resultado')
      } finally {
        setCurrentPlayer(null)
      }
    },
    [currentPlayer]
  )

  const resetAll = async () => {
    if (!session) {
      return
    }

    setIsResetting(true)

    try {
      const response = await fetch('/api/competition', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionId: session.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'No se pudo reiniciar la sesion')
      }

      setParticipants([])
      toast.success('Sesion reiniciada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reiniciar la sesion')
    } finally {
      setIsResetting(false)
    }
  }

  const shareLink = () => {
    if (!session) {
      return
    }

    const url = `${window.location.origin}${session.publicPath}`
    navigator.clipboard.writeText(url)
    toast.success('Link publico copiado al portapapeles')
  }

  const pendingPlayers = participants.filter((participant) => !participant.completed)
  const completedPlayers = participants.filter((participant) => participant.completed)
  const allDone = participants.length > 0 && pendingPlayers.length === 0
  const winner = allDone
    ? [...completedPlayers].sort(
        (left, right) => (left.timeSeconds ?? Number.POSITIVE_INFINITY) - (right.timeSeconds ?? Number.POSITIVE_INFINITY)
      )[0]
    : null

  const activeParticipant = participants.find((participant) => participant.id === currentPlayer)

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Speed<span className="text-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">by AndesTech</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            No hay una sesion activa. Crea o activa una sesion desde el panel admin para comenzar a registrar turnos.
          </p>
          <Button asChild size="lg">
            <a href="/admin">Abrir panel admin</a>
          </Button>
        </div>
      </div>
    )
  }

  if (isResetting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Speed<span className="text-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">by AndesTech</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{session.name}</p>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>{session.location}</span>
            <span>•</span>
            <span>{session.eventDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={shareLink} className="gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Compartir link
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin">Panel admin</a>
            </Button>
          </div>
        </div>

        {allDone && winner ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center space-y-2">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-xs uppercase tracking-widest text-amber-500">Ganador</p>
            <p className="text-2xl font-bold text-amber-500">{winner.name}</p>
            <p className="text-muted-foreground text-sm">
              {winner.timeSeconds?.toFixed(1)}s - {winner.wpm} WPM - {winner.errors} errores
            </p>
          </div>
        ) : null}

        {activeParticipant ? (
          <TypingTest
            participantName={activeParticipant.name}
            text={activeParticipant.text}
            onComplete={handleComplete}
            onCancel={() => setCurrentPlayer(null)}
          />
        ) : (
          <>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Agregar participante</h2>
              <ParticipantForm
                onAdd={addParticipant}
                existingNames={participants.map((participant) => participant.name.toLowerCase())}
              />
            </div>

            {pendingPlayers.length > 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Iniciar turno</h2>
                <div className="flex flex-wrap gap-2">
                  {pendingPlayers.map((participant) => (
                    <Button
                      key={participant.id}
                      variant="outline"
                      onClick={() => setCurrentPlayer(participant.id)}
                      className="gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {participant.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Clasificacion</h2>
                <div className="flex gap-2">
                  {participants.length > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAll}
                      className="gap-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reiniciar
                    </Button>
                  ) : null}
                </div>
              </div>
              <Leaderboard participants={participants} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}