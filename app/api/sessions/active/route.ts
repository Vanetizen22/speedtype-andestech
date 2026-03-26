import { NextResponse } from 'next/server'
import { getActiveSession, getLeaderboardBySessionId } from '@/lib/data'

export async function GET() {
  try {
    const session = await getActiveSession()

    if (!session) {
      return NextResponse.json({ session: null, leaderboard: [] })
    }

    const leaderboard = await getLeaderboardBySessionId(session.id)
    return NextResponse.json({ session, leaderboard })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudo obtener la sesion activa' }, { status: 500 })
  }
}