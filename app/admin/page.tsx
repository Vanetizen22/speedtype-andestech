import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { getAuthenticatedAdminSession } from '@/lib/auth'
import { listSessionsWithCounts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const adminSession = await getAuthenticatedAdminSession()

  if (!adminSession) {
    redirect('/admin/login')
  }

  const sessions = await listSessionsWithCounts()

  return <AdminDashboard initialSessions={sessions} />
}