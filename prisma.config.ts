import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'
import { resolve } from 'path'

// Load .env.local first (Next.js convention), then fall back to .env
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

// For migrations, use DIRECT_URL if available, otherwise convert to session pooling
// Supabase session pooling (port 6543) works with migrations, transaction pooling (port 5432) does not
let databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL or DIRECT_URL environment variable is not set. Please ensure it is set in .env.local or .env file'
  )
}

// Convert Supabase pooler URL to session pooling (port 6543) for migrations
if (!process.env.DIRECT_URL && databaseUrl.includes('pooler.supabase.com')) {
  // Convert from transaction pooling (5432) to session pooling (6543)
  // Session pooling supports migrations, transaction pooling does not
  databaseUrl = databaseUrl.replace(/:5432\//, ':6543/')
  
  // Remove any existing query parameters and add SSL mode
  const urlParts = databaseUrl.split('?')
  const baseUrl = urlParts[0]
  databaseUrl = `${baseUrl}?sslmode=require`
  
  console.log('Using session pooling (port 6543) for migrations')
} else if (databaseUrl.includes('pgbouncer=true') && !process.env.DIRECT_URL) {
  // Remove pgbouncer parameter and add SSL
  databaseUrl = databaseUrl.replace(/[?&]pgbouncer=true/, '').replace(/\?$/, '')
  const separator = databaseUrl.includes('?') ? '&' : '?'
  databaseUrl = `${databaseUrl}${separator}sslmode=require`
  console.log('Using direct connection URL (pgbouncer removed, SSL added)')
} else if (!databaseUrl.includes('sslmode=') && databaseUrl.includes('supabase')) {
  // Add SSL mode if missing for Supabase connections
  const separator = databaseUrl.includes('?') ? '&' : '?'
  databaseUrl = `${databaseUrl}${separator}sslmode=require`
  console.log('Added SSL mode for Supabase connection')
}

// Debug: show which URL is being used (mask password for security)
const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@')
console.log('Database URL:', maskedUrl)

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
})

