import Link from 'next/link'
import { Eye, Keyboard, Shield, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SessionQrCard } from '@/components/session-qr-card'
import type { SessionSummary } from '@/lib/types'

interface PublicHomeScreenProps {
  activeSession: SessionSummary | null
}

export function PublicHomeScreen({ activeSession }: PublicHomeScreenProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col items-center justify-center gap-8 text-center">
        <div>
          <p className="mb-3 text-sm text-muted-foreground/70">by AndesTech</p>
          <div className="mb-4 flex items-center justify-center gap-3">
            <Keyboard className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Speed<span className="text-primary">Type</span>
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            La operacion y el registro de turnos solo estan disponibles para el administrador autenticado.
          </p>
        </div>

        {activeSession ? (
          <div className="w-full rounded-3xl border border-border bg-card/75 p-6 text-left">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Eye className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">Vista publica</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">{activeSession.name}</h2>
            <p className="mt-2 text-muted-foreground">
              {activeSession.location} • {activeSession.eventDate}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              La clasificacion muestra los mejores tiempos de la sesion activa.
            </p>
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href={activeSession.publicPath}>
                    <Trophy className="mr-2 h-5 w-5" />
                    Ver clasificacion
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/admin/login">
                    <Shield className="mr-2 h-5 w-5" />
                    Acceso admin
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <SessionQrCard publicPath={activeSession.publicPath} sessionName={activeSession.name} />
            </div>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-dashed border-border bg-card/40 p-8">
            <p className="text-xl font-semibold text-foreground">No hay una sesion activa</p>
            <p className="mt-2 text-muted-foreground">
              Cuando un administrador active una sesion, desde aqui se podra consultar la clasificacion publica.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/admin/login">
                  <Shield className="mr-2 h-4 w-4" />
                  Ir al acceso admin
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}