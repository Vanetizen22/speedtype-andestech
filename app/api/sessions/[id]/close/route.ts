import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { listSessionsWithCounts } from '@/lib/data'
import { getDb } from '@/lib/db'
import { sessions } from '@/lib/db/schema'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_: Request, context: RouteContext) {
  const db = getDb()
  const adminSession = await getAuthenticatedAdminSession()

  if (!adminSession) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params

  const result = await db
    .update(sessions)
    .set({
      isActive: false,
      status: 'closed',
      updatedAt: new Date(),
    })
    .where(and(eq(sessions.id, id), eq(sessions.isActive, true)))
    .returning({ id: sessions.id })

  if (result.length === 0) {
    return NextResponse.json({ error: 'La sesion ya no esta activa o no existe' }, { status: 404 })
  }

  const allSessions = await listSessionsWithCounts()
  return NextResponse.json({ sessions: allSessions })
}