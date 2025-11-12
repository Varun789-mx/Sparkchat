import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  // await prisma.message.deleteMany();
  // await prisma.conversation.deleteMany();
  // await prisma.app.deleteMany();
  // await prisma.execution.deleteMany();
  // await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
      credits: 10,
      isPremium: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword,
      credits: 3,
      isPremium: false,
    },
  });

  console.log('Created users:', { user1, user2 });

  // Create executions for user1
  const execution1 = await prisma.execution.create({
    data: {
      title: 'My First Conversation',
      type: 'CONVERSATION',
      userId: user1.id,
      externalId: 'conv-001',
    },
  });

  const execution2 = await prisma.execution.create({
    data: {
      title: 'Article Summary: AI Trends 2024',
      type: 'ARTICLE_SUMMARIZER',
      userId: user1.id,
      externalId: 'summary-001',
    },
  });

  const execution3 = await prisma.execution.create({
    data: {
      title: 'Portfolio Website',
      type: 'WEBSITE_CREATOR',
      userId: user1.id,
      externalId: 'web-001',
    },
  });

  // Create executions for user2
  const execution4 = await prisma.execution.create({
    data: {
      title: 'Chat about React',
      type: 'CONVERSATION',
      userId: user2.id,
    },
  });

  console.log('Created executions');

  // Create conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'USER',
            content: 'Hello! Can you help me with Next.js?',
          },
          {
            role: 'ASSISTANT',
            content: 'Of course! I\'d be happy to help you with Next.js. What would you like to know?',
          },
          {
            role: 'USER',
            content: 'How do I set up server components?',
          },
          {
            role: 'ASSISTANT',
            content: 'Server Components are the default in Next.js 13+. Just create components without "use client" directive.',
          },
        ],
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'USER',
            content: 'Tell me about TypeScript',
          },
          {
            role: 'ASSISTANT',
            content: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
          },
        ],
      },
    },
  });

  console.log('Created conversations with messages');

  // Create apps
  const app1 = await prisma.app.create({
    data: {
      name: 'Task Manager',
      description: 'A simple task management application',
      icon: '✅',
      conversationId: conversation1.id,
    },
  });

  const app2 = await prisma.app.create({
    data: {
      name: 'Weather Dashboard',
      description: 'Real-time weather information',
      icon: '🌤️',
      conversationId: conversation2.id,
    },
  });

  console.log('Created apps:', { app1, app2 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });