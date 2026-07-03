import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = process.env.SQLITE_PATH || './db/leads.sqlite'

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.resolve(DB_PATH)
    db = new Database(dbPath)
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        model TEXT,
        usage TEXT,
        zone TEXT,
        delay TEXT,
        budget TEXT,
        source TEXT DEFAULT 'whatsapp',
        status TEXT DEFAULT 'new',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('[DB] SQLite ready:', dbPath)
  }
  return db
}

export function insertLead(data: {
  name: string
  phone: string
  model?: string
  usage?: string
  zone?: string
  delay?: string
  budget?: string
  source?: string
}): number {
  const d = getDb()
  const stmt = d.prepare(`
    INSERT INTO leads (name, phone, model, usage, zone, delay, budget, source)
    VALUES (@name, @phone, @model, @usage, @zone, @delay, @budget, @source)
  `)
  const result = stmt.run({
    name: data.name,
    phone: data.phone,
    model: data.model || null,
    usage: data.usage || null,
    zone: data.zone || null,
    delay: data.delay || null,
    budget: data.budget || null,
    source: data.source || 'whatsapp',
  })
  return Number(result.lastInsertRowid)
}

export function getLeads(limit = 20) {
  return getDb().prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?').all(limit)
}
