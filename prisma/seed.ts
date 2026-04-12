// Legt Initial-Admin und SMTP-Startdaten an
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('password', 12)

  await prisma.user.upsert({
    where: { email: 'dennis@suchycreative.de' },
    update: {},
    create: {
      username: 'dennis',
      email: 'dennis@suchycreative.de',
      passwordHash: hash,
      role: 'admin',
    },
  })

  // SMTP-Startdaten
  const smtpDefaults = [
    { key: 'smtp_host',      value: 'mail.scpreview.de' },
    { key: 'smtp_port',      value: '587' },
    { key: 'smtp_user',      value: 'website@scpreview.de' },
    { key: 'smtp_pass',      value: '' },
    { key: 'smtp_from',      value: 'noreply@vandelejk-immobilien.de' },
    { key: 'smtp_from_name', value: 'VandeLejk Immobilien' },
  ]

  for (const s of smtpDefaults) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }

  console.log('✓ Admin dennis@suchycreative.de angelegt')
  console.log('✓ SMTP-Startdaten gesetzt')
}

main().finally(() => prisma.$disconnect())
