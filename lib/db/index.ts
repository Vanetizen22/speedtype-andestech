import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>
  database?: PostgresJsDatabase<typeof schema>
}

export function getDb() {
  if (globalForDb.database) {
    return globalForDb.database
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no esta configurada')
  }

  const client = globalForDb.postgresClient ?? postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
  })

  const database = drizzle(client, { schema })

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.postgresClient = client
    globalForDb.database = database
  }

  return database
}