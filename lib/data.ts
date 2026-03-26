import { asc, desc, eq, sql } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { results, sessions } from '@/lib/db/schema'
import type { LeaderboardEntry, ParticipantDraft, SessionSummary } from '@/lib/types'

function toDateString(value: Date | string) {
  if (typeof value === 'string') {
    return value
  }

  return value.toISOString().slice(0, 10)
}

function mapSession(
  row: typeof sessions.$inferSelect & { participantCount?: number | null }
): SessionSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    eventDate: toDateString(row.eventDate),
    status: row.status,
    isActive: row.isActive,
    participantCount: Number(row.participantCount ?? 0),
    publicPath: `/s/${row.slug}`,
  }
}

function mapParticipant(row: typeof results.$inferSelect): ParticipantDraft {
  return {
    id: row.id,
    name: row.name,
    text: row.text,
    timeSeconds: row.timeSeconds ?? null,
    errors: row.errors,
    wpm: row.wpm,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
  }
}

function mapLeaderboardEntry(row: typeof results.$inferSelect, index: number): LeaderboardEntry {
  return {
    id: row.id,
    name: row.name,
    text: row.text,
    socialHandle: row.socialHandle ?? undefined,
    timeSeconds: row.timeSeconds ?? 0,
    errors: row.errors,
    wpm: row.wpm,
    createdAt: row.createdAt.toISOString(),
    position: index + 1,
  }
}

export async function getActiveSession() {
  const db = getDb()
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.isActive, true))
    .orderBy(desc(sessions.updatedAt))
    .limit(1)

  return session ? mapSession(session) : null
}

export async function getSessionBySlug(slug: string) {
  const db = getDb()
  const [session] = await db.select().from(sessions).where(eq(sessions.slug, slug)).limit(1)

  return session ? mapSession(session) : null
}

export async function getSessionById(id: string) {
  const db = getDb()
  const [session] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)

  return session ? mapSession(session) : null
}

export async function getParticipantsBySessionId(sessionId: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(results)
    .where(eq(results.sessionId, sessionId))
    .orderBy(asc(results.createdAt))

  return rows.map(mapParticipant)
}

export async function getLeaderboardBySessionId(sessionId: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(results)
    .where(eq(results.sessionId, sessionId))
    .orderBy(asc(results.timeSeconds), asc(results.createdAt))

  return rows.filter((row) => row.completed && row.timeSeconds !== null).map(mapLeaderboardEntry)
}

export async function listSessionsWithCounts() {
  const db = getDb()
  const rows = await db
    .select({
      id: sessions.id,
      slug: sessions.slug,
      name: sessions.name,
      location: sessions.location,
      eventDate: sessions.eventDate,
      status: sessions.status,
      isActive: sessions.isActive,
      createdAt: sessions.createdAt,
      updatedAt: sessions.updatedAt,
      participantCount: sql<number>`count(${results.id})`,
    })
    .from(sessions)
    .leftJoin(results, eq(results.sessionId, sessions.id))
    .groupBy(sessions.id)
    .orderBy(desc(sessions.eventDate), desc(sessions.createdAt))

  return rows.map(mapSession)
}

export async function ensureUniqueSessionSlug(baseSlug: string) {
  const db = getDb()
  let slug = baseSlug
  let suffix = 1

  while (true) {
    const [existing] = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.slug, slug)).limit(1)

    if (!existing) {
      return slug
    }

    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }
}