import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { getActiveSession, getLeaderboardBySessionId, getParticipantsBySessionId } from '@/lib/data'
import { getDb } from '@/lib/db'
import { results } from '@/lib/db/schema'
import { findDuplicateParticipant } from '@/lib/participant-rules'

const createResultSchema = z.object({
  name: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1),
  timeSeconds: z.number().positive(),
  errors: z.number().int().min(0),
  wpm: z.number().int().min(0),
})

export async function POST(request: Request) {
  try {
    const adminSession = await getAuthenticatedAdminSession()

    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const db = getDb()
    const body = createResultSchema.parse(await request.json())
    const session = await getActiveSession()

    if (!session) {
      return NextResponse.json({ error: 'No hay una sesion activa' }, { status: 400 })
    }

    const participants = await getParticipantsBySessionId(session.id)
    const duplicateEntry = findDuplicateParticipant(participants, { name: body.name })

    if (duplicateEntry) {
      return NextResponse.json({ error: `${duplicateEntry.name} ya participo en esta sesion.` }, { status: 409 })
    }

    const [created] = await db
      .insert(results)
      .values({
        sessionId: session.id,
        name: body.name,
        text: body.text,
        timeSeconds: body.timeSeconds,
        errors: body.errors,
        wpm: body.wpm,
        completed: true,
      })
      .returning()

    const updatedLeaderboard = await getLeaderboardBySessionId(session.id)
    const currentEntry = updatedLeaderboard.find((entry) => entry.id === created.id) ?? null

    return NextResponse.json({
      session,
      entry: currentEntry,
      leaderboard: updatedLeaderboard,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo guardar el resultado' }, { status: 500 })
  }
}