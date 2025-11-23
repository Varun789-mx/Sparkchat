// prisma/seed.js
import { PrismaClient } from '@prisma/client'
import { prisma } from "@/lib/prisma";

async function main() {
  console.log('��� Starting database seed...')

  // Clean up previous data (optional, helps when re-seeding)
  await prisma.message.deleteMany()
  await prisma.app.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.user.deleteMany()

  // --- Create Users ---
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      credits: 5,
      isPremium: false,
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      credits: 10,
      isPremium: true,
    },
  })

  // --- Create Conversations ---
  const conversation1 = await prisma.conversation.create({ data: {} })
  const conversation2 = await prisma.conversation.create({ data: {} })

  // --- Create Messages ---
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation1.id,
        role: 'user',
        content: 'Hey, how are you?',
      },
      {
        conversationId: conversation1.id,
        role: 'assistant',
        content: 'I’m doing great! How can I help you today?',
      },
      {
        conversationId: conversation2.id,
        role: 'user',
        content: 'Tell me a joke.',
      },
      {
        conversationId: conversation2.id,
        role: 'assistant',
        content: 'Why did the developer go broke? Because he used up all his cache!',
      },
    ],
  })

  // --- Create Apps ---
  const app1 = await prisma.app.create({
    data: {
      name: 'Chat Assistant',
      description: 'An AI chat assistant for productivity.',
      icon: '���',
      conversationId: conversation1.id,
    },
  })

  const app2 = await prisma.app.create({
    data: {
      name: 'Joke Bot',
      description: 'Tells you programming jokes.',
      icon: '���',
      conversationId: conversation2.id,
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log({ alice, bob, app1, app2 })
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

