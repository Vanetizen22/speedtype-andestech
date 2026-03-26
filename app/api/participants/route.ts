import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { getActiveSession, getParticipantsBySessionId } from '@/lib/data'
import { getDb } from '@/lib/db'
import { results } from '@/lib/db/schema'
import { findDuplicateParticipant } from '@/lib/participant-rules'

const createParticipantSchema = z.object({
  name: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1),
})

const updateParticipantSchema = z.object({
  id: z.string().uuid(),
  time_seconds: z.number().positive(),
  errors: z.number().int().min(0),
  wpm: z.number().int().min(0),
})

export async function POST(request: Request) {
  try {
    const adminSession = await getAuthenticatedAdminSession()

    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const session = await getActiveSession()

    if (!session) {
      return NextResponse.json({ error: 'No hay una sesion activa' }, { status: 400 })
    }

    const body = createParticipantSchema.parse(await request.json())
    const existingParticipants = await getParticipantsBySessionId(session.id)
    const duplicateParticipant = findDuplicateParticipant(existingParticipants, { name: body.name })

    if (duplicateParticipant) {
      return NextResponse.json({ error: 'Ese participante ya fue cargado en la sesion activa' }, { status: 409 })
    }

    const db = getDb()
    const [participant] = await db
      .insert(results)
      .values({
        sessionId: session.id,
        name: body.name,
        text: body.text,
      })
      .returning()

    return NextResponse.json({
      participant: {
        id: participant.id,
        name: participant.name,
        text: participant.text,
        timeSeconds: participant.timeSeconds,
        errors: participant.errors,
        wpm: participant.wpm,
        completed: participant.completed,
        createdAt: participant.createdAt.toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo agregar el participante' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const adminSession = await getAuthenticatedAdminSession()

    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = updateParticipantSchema.parse(await request.json())
    const db = getDb()
    const [participant] = await db
      .update(results)
      .set({
        timeSeconds: body.time_seconds,
        errors: body.errors,
        wpm: body.wpm,
        completed: true,
      })
      .where(eq(results.id, body.id))
      .returning()

    if (!participant) {
      return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        name: participant.name,
        text: participant.text,
        timeSeconds: participant.timeSeconds,
        errors: participant.errors,
        wpm: participant.wpm,
        completed: participant.completed,
        createdAt: participant.createdAt.toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo guardar el resultado' }, { status: 500 })
  }
}
