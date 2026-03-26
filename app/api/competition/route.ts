import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { getActiveSession, getParticipantsBySessionId } from '@/lib/data'
import { getDb } from '@/lib/db'
import { results } from '@/lib/db/schema'

const resetCompetitionSchema = z.object({
  competitionId: z.string().uuid(),
})

export async function GET() {
  try {
    const session = await getActiveSession()

    if (!session) {
      return NextResponse.json({ competition: null, participants: [] })
    }

    const participants = await getParticipantsBySessionId(session.id)
    return NextResponse.json({ competition: session, participants })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudo obtener la sesion activa' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const adminSession = await getAuthenticatedAdminSession()

    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = resetCompetitionSchema.parse(await request.json())
    const db = getDb()

    await db.delete(results).where(eq(results.sessionId, body.competitionId))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo reiniciar la sesion' }, { status: 500 })
  }
}
