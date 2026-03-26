'use client'

import QRCode from 'react-qr-code'

interface SessionQrCardProps {
  publicPath: string
  sessionName: string
  compact?: boolean
}

export function SessionQrCard({ publicPath, sessionName, compact = false }: SessionQrCardProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const sessionUrl = `${baseUrl}${publicPath}`

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <p className="text-sm font-medium text-foreground">Compartir clasificacion</p>
      <p className="mt-1 text-xs text-muted-foreground">{sessionName}</p>
      <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
        {baseUrl ? <QRCode value={sessionUrl} size={compact ? 132 : 180} /> : null}
      </div>
      <p className="mt-3 break-all text-xs text-muted-foreground">{sessionUrl || publicPath}</p>
    </div>
  )
}