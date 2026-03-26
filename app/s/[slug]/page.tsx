import { notFound } from 'next/navigation'
import { PublicSessionView } from '@/components/public-session-view'
import { getLeaderboardBySessionId, getSessionBySlug } from '@/lib/data'

export const dynamic = 'force-dynamic'

interface SessionPageProps {
  params: Promise<{ slug: string }>
}

export default async function SessionLeaderboardPage({ params }: SessionPageProps) {
  const { slug } = await params
  const session = await getSessionBySlug(slug)

  if (!session) {
    notFound()
  }

  const leaderboard = await getLeaderboardBySessionId(session.id)

  return <PublicSessionView session={session} leaderboard={leaderboard} />
}