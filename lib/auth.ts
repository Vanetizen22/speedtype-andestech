import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { and, eq, gt } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { adminSessions } from '@/lib/db/schema'

export const ADMIN_COOKIE_NAME = 'speedtype_admin_session'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME y ADMIN_PASSWORD deben estar configurados')
  }

  return { username, password }
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function validateAdminCredentials(username: string, password: string) {
  const expected = getAdminCredentials()
  return safeCompare(username, expected.username) && safeCompare(password, expected.password)
}

export async function createAdminSession() {
  const db = getDb()
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await db.insert(adminSessions).values({
    tokenHash: hashToken(token),
    expiresAt,
  })

  return { token, expiresAt }
}

export async function destroyAdminSession(token: string) {
  const db = getDb()
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)))
}

export async function getAuthenticatedAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const db = getDb()
  const [session] = await db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.tokenHash, hashToken(token)), gt(adminSessions.expiresAt, new Date())))
    .limit(1)

  return session ?? null
}