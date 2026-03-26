import { and, eq, ne } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { ensureUniqueSessionSlug, listSessionsWithCounts } from '@/lib/data'
import { getDb } from '@/lib/db'
import { sessions } from '@/lib/db/schema'

const createSessionSchema = z.object({
  name: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  activateNow: z.boolean().optional().default(false),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  const session = await getAuthenticatedAdminSession()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const allSessions = await listSessionsWithCounts()
  return NextResponse.json({ sessions: allSessions })
}

export async function POST(request: Request) {
  try {
    const db = getDb()
    const adminSession = await getAuthenticatedAdminSession()

    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = createSessionSchema.parse(await request.json())
    const baseSlug = slugify(`${body.name}-${body.eventDate}`)
    const slug = await ensureUniqueSessionSlug(baseSlug)

    const [activeSession] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.isActive, true))
      .limit(1)

    const activateNow = body.activateNow || !activeSession
    let createdSessionId = ''

    await db.transaction(async (tx) => {
      if (activateNow) {
        await tx
          .update(sessions)
          .set({
            isActive: false,
            status: 'draft',
            updatedAt: new Date(),
          })
          .where(and(eq(sessions.isActive, true), ne(sessions.status, 'closed')))
      }

      const [created] = await tx
        .insert(sessions)
        .values({
          slug,
          name: body.name,
          location: body.location,
          eventDate: new Date(body.eventDate),
          isActive: activateNow,
          status: activateNow ? 'active' : 'draft',
          updatedAt: new Date(),
        })
        .returning({ id: sessions.id })

      createdSessionId = created.id
    })

    const allSessions = await listSessionsWithCounts()
    const createdSession = allSessions.find((session) => session.id === createdSessionId) ?? null

    return NextResponse.json({ session: createdSession, sessions: allSessions }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo crear la sesion' }, { status: 500 })
  }
}