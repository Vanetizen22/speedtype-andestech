import { NextResponse } from 'next/server'
import { getLeaderboardBySessionId, getSessionBySlug } from '@/lib/data'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { slug } = await context.params
    const session = await getSessionBySlug(slug)

    if (!session) {
      return NextResponse.json({ error: 'Sesion no encontrada' }, { status: 404 })
    }

    const leaderboard = await getLeaderboardBySessionId(session.id)
    return NextResponse.json({ session, leaderboard })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudo cargar la clasificacion' }, { status: 500 })
  }
}