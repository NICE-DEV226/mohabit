import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
  }

  const hashedPassword = bcrypt.hashSync(adminPassword, 10)

  return NextResponse.json({
    email: adminEmail,
    passwordHash: hashedPassword,
    message: 'Use these credentials in your .env.local',
  })
}
