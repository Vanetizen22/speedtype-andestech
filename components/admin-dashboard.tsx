'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Lock, LogOut, MapPin, Plus, Radio, Shield, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SessionQrCard } from '@/components/session-qr-card'
import type { SessionSummary } from '@/lib/types'

interface AdminDashboardProps {
  initialSessions: SessionSummary[]
}

export function AdminDashboard({ initialSessions }: AdminDashboardProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [activateNow, setActivateNow] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCreateSession = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        location,
        eventDate,
        activateNow,
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'No se pudo crear la sesion' }))
      setError(payload.error ?? 'No se pudo crear la sesion')
      return
    }

    setName('')
    setLocation('')
    setEventDate('')
    startTransition(() => {
      router.refresh()
    })
  }

  const handleActivate = async (sessionId: string) => {
    setError(null)

    const response = await fetch(`/api/sessions/${sessionId}/activate`, {
      method: 'POST',
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'No se pudo activar la sesion' }))
      setError(payload.error ?? 'No se pudo activar la sesion')
      return
    }

    startTransition(() => {
      router.refresh()
    })
  }

  const handleCloseActiveSession = async (sessionId: string) => {
    setError(null)

    const response = await fetch(`/api/sessions/${sessionId}/close`, {
      method: 'POST',
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'No se pudo cerrar la sesion activa' }))
      setError(payload.error ?? 'No se pudo cerrar la sesion activa')
      return
    }

    startTransition(() => {
      router.refresh()
    })
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/75 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">Administracion</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sesiones del evento</h1>
            <p className="text-muted-foreground">
              Crea sesiones independientes y define cual esta activa para registrar turnos.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleCreateSession} className="rounded-3xl border border-border bg-card/75 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Nueva sesion</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Nombre</Label>
                <Input id="session-name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-location">Lugar</Label>
                <Input id="session-location" value={location} onChange={(event) => setLocation(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-date">Fecha</Label>
                <Input id="session-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={activateNow}
                  onChange={(event) => setActivateNow(event.target.checked)}
                  className="h-4 w-4"
                />
                Activar esta sesion inmediatamente
              </label>
            </div>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="mt-6 w-full" disabled={isPending}>
              Crear sesion
            </Button>
          </form>

          <div className="space-y-4">
            {initialSessions.map((session) => (
              <div key={session.id} className="rounded-3xl border border-border bg-card/75 p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-semibold text-foreground">{session.name}</h3>
                      {session.isActive ? (
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                          Activa
                        </span>
                      ) : null}
                      {session.status === 'closed' ? (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Cerrada
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {session.location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {session.eventDate}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        {session.participantCount} participantes
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={session.isActive ? 'secondary' : 'default'}
                        onClick={() => handleActivate(session.id)}
                        disabled={session.isActive || session.status === 'closed' || isPending}
                      >
                        <Radio className="mr-2 h-4 w-4" />
                        {session.isActive ? 'Sesion operativa' : session.status === 'closed' ? 'Sesion cerrada' : 'Activar'}
                      </Button>
                      {session.isActive ? (
                        <Button variant="destructive" onClick={() => handleCloseActiveSession(session.id)} disabled={isPending}>
                          <Lock className="mr-2 h-4 w-4" />
                          Cerrar sesion activa
                        </Button>
                      ) : null}
                      <Button asChild variant="outline">
                        <a href={session.publicPath} target="_blank" rel="noreferrer">
                          Abrir vista publica
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="xl:w-[320px]">
                    <SessionQrCard publicPath={session.publicPath} sessionName={session.name} compact />
                  </div>
                </div>
              </div>
            ))}

            {initialSessions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-12 text-center text-muted-foreground">
                Aun no hay sesiones creadas.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}