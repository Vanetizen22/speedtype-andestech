'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    setIsSubmitting(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'No se pudo iniciar sesion' }))
      setError(payload.error ?? 'No se pudo iniciar sesion')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-border bg-card/80 p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 p-4 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Acceso admin</h1>
          <p className="mt-2 text-muted-foreground">
            Inicia sesion para crear y operar sesiones persistentes de SpeedType.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          <LockKeyhole className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </div>
  )
}