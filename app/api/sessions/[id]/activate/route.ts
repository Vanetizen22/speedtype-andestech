import { and, eq, ne } from 'drizzle-orm'
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

  const [targetSession] = await db
    .select({ id: sessions.id, status: sessions.status })
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1)

  if (!targetSession) {
    return NextResponse.json({ error: 'La sesion no existe' }, { status: 404 })
  }

  if (targetSession.status === 'closed') {
    return NextResponse.json({ error: 'La sesion cerrada no se puede reactivar' }, { status: 400 })
  }

  await db.transaction(async (tx) => {
    await tx
      .update(sessions)
      .set({
        isActive: false,
        status: 'draft',
        updatedAt: new Date(),
      })
      .where(and(eq(sessions.isActive, true), ne(sessions.status, 'closed')))

    await tx
      .update(sessions)
      .set({
        isActive: true,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, id))
  })

  const allSessions = await listSessionsWithCounts()
  return NextResponse.json({ sessions: allSessions })
}