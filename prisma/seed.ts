import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log('Clearing existing data...');
  await prisma.message.deleteMany();
  await prisma.app.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.execution.deleteMany();
  await prisma.user.deleteMany();
  console.log('Existing data cleared.');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
      credits: 10,
      isPremium: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword,
      credits: 3,
      isPremium: false,
    },
  });

  console.log('✓ Created users');

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
      externalId: 'conv-002',
    },
  });

  // Create multiple executions with varied types
  const executionTypes = ['CONVERSATION', 'ARTICLE_SUMMARIZER', 'WEBSITE_CREATOR'] as const;

  for (let i = 5; i <= 25; i++) {
    const typeIndex = i % 3;
    const type = executionTypes[typeIndex];

    await prisma.execution.create({
      data: {
        title: `${type.replace('_', ' ').toLowerCase()} ${i}`,
        type: type,
        userId: i % 2 === 0 ? user2.id : user1.id, // Alternate between users
        externalId: `exec-${i.toString().padStart(3, '0')}`,
      },
    });
  }

  console.log('✓ Created executions');

  // Create conversations with messages
  const conversation1 = await prisma.conversation.create({
    data: {
      userId: user1.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hello! Can you help me with Next.js?',
          },
          {
            role: 'assistant',
            content: 'Of course! I\'d be happy to help you with Next.js. What would you like to know?',
          },
          {
            role: 'user',
            content: 'How do I set up server components?',
          },
          {
            role: 'assistant',
            content: 'Server Components are the default in Next.js 13+. Just create components without "use client" directive.',
          },
          {
            role: 'user',
            content: 'Can you show me an example?',
          },
          {
            role: 'assistant',
            content: 'Sure! Here\'s a simple server component:\n\n```tsx\nexport default function ServerComponent() {\n  return <div>Hello from Server</div>;\n}\n```',
          },
        ],
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      userId: user2.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Tell me about TypeScript',
          },
          {
            role: 'assistant',
            content: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
          },
          {
            role: 'user',
            content: 'What are the benefits?',
          },
          {
            role: 'assistant',
            content: 'TypeScript provides type safety, better IDE support, catches errors at compile time, and improves code maintainability.',
          },
        ],
      },
    },
  });

  const conversation3 = await prisma.conversation.create({
    data: {
      userId: user1.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'What is Prisma?',
          },
          {
            role: 'assistant',
            content: 'Prisma is a next-generation ORM for Node.js and TypeScript that provides type-safe database access.',
          },
          {
            role: 'user',
            content: 'How does it compare to other ORMs?',
          },
          {
            role: 'assistant',
            content: 'Prisma offers better type safety, intuitive API, automatic migrations, and excellent developer experience compared to traditional ORMs.',
          },
        ],
      },
    },
  });

  const conversation4 = await prisma.conversation.create({
    data: {
      userId: user2.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'How do I deploy a Next.js app?',
          },
          {
            role: 'assistant',
            content: 'You can deploy Next.js apps to Vercel, Netlify, AWS, or any Node.js hosting platform. Vercel is the easiest option.',
          },
        ],
      },
    },
  });

  console.log('✓ Created conversations with messages');

  // Create apps linked to conversations
  const app1 = await prisma.app.create({
    data: {
      name: 'Task Manager',
      description: 'A simple task management application with real-time updates',
      icon: '✅',
      userId: user1.id,
      conversationId: conversation1.id,
    },
  });

  const app2 = await prisma.app.create({
    data: {
      name: 'Weather Dashboard',
      description: 'Real-time weather information with 7-day forecast',
      icon: '🌤️',
      userId: user2.id,
      conversationId: conversation2.id,
    },
  });

  const app3 = await prisma.app.create({
    data: {
      name: 'Code Snippet Manager',
      description: 'Organize and share code snippets with syntax highlighting',
      icon: '💻',
      userId: user1.id,
      conversationId: conversation3.id,
    },
  });

  const app4 = await prisma.app.create({
    data: {
      name: 'Portfolio Builder',
      description: 'Create beautiful portfolio websites in minutes',
      icon: '🎨',
      userId: user2.id,
      conversationId: conversation4.id,
    },
  });

  console.log('✓ Created apps');

  // Summary
  const userCount = await prisma.user.count();
  const executionCount = await prisma.execution.count();
  const conversationCount = await prisma.conversation.count();
  const messageCount = await prisma.message.count();
  const appCount = await prisma.app.count();

  console.log('\n=== Seeding Summary ===');
  console.log(`Users: ${userCount}`);
  console.log(`Executions: ${executionCount}`);
  console.log(`Conversations: ${conversationCount}`);
  console.log(`Messages: ${messageCount}`);
  console.log(`Apps: ${appCount}`);
  console.log('=====================\n');

  console.log('✅ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });