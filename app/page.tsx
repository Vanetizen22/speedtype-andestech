import { OperatorApp } from '@/components/operator-app'
import { PublicHomeScreen } from '@/components/public-home-screen'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { getActiveSession, getParticipantsBySessionId } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [adminSession, activeSession] = await Promise.all([
    getAuthenticatedAdminSession(),
    getActiveSession(),
  ])

  if (adminSession) {
    const participants = activeSession ? await getParticipantsBySessionId(activeSession.id) : []
    return <OperatorApp initialSession={activeSession} initialParticipants={participants} />
  }

  return <PublicHomeScreen activeSession={activeSession} />
}
