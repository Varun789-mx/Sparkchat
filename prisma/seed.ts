import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)

  await prisma.app.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.execution.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.message.deleteMany();
  console.log("✨ Cleared existing data");

  // Create users
  const hashedPassword = await hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      credits: 10,
      isPremium: true,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      credits: 3,
      isPremium: false,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
  });

  console.log("👥 Created users");

  // Create accounts (OAuth)
  await prisma.account.create({
    data: {
      userId: user1.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "google-123456",
      access_token: "mock-access-token",
      token_type: "Bearer",
      scope: "openid profile email",
    },
  });

  console.log("🔐 Created accounts");

  // Create conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      userId: user1.id,
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      userId: user2.id,
    },
  });

  console.log("💬 Created conversations");

  // Create apps
  await prisma.app.create({
    data: {
      name: "Task Manager",
      description: "A simple task management application",
      icon: "✅",
      userId: user1.id,
      conversationId: conversation1.id,
    },
  });

  await prisma.app.create({
    data: {
      name: "Weather Dashboard",
      description: "Real-time weather information display",
      icon: "🌤️",
      userId: user1.id,
      conversationId: conversation1.id,
    },
  });

  await prisma.app.create({
    data: {
      name: "Budget Tracker",
      description: "Personal finance tracking tool",
      icon: "💰",
      userId: user2.id,
      conversationId: conversation2.id,
    },
  });

  console.log("📱 Created apps");

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation1.id,
        role: "user",
        content: "Can you help me create a task manager app?",
      },
      {
        conversationId: conversation1.id,
        role: "assistant",
        content:
          "Of course! I can help you create a task manager application. What features would you like to include?",
      },
      {
        conversationId: conversation1.id,
        role: "user",
        content: "I need to add tasks, mark them as complete, and delete them.",
      },
      {
        conversationId: conversation2.id,
        role: "user",
        content: "I want to build a budget tracking app.",
      },
      {
        conversationId: conversation2.id,
        role: "assistant",
        content:
          "Great idea! A budget tracker can help you manage your finances effectively. Let me help you build one.",
      },
    ],
  });

  console.log("💬 Created messages");

  // Create executions
  await prisma.execution.createMany({
    data: [
      {
        title: "Task Manager Conversation",
        type: "CONVERSATION",
        userId: user1.id,
        externalId: "conv-001",
      },
      {
        title: "Blog Post Summary",
        type: "ARTICLE_SUMMARIZER",
        userId: user1.id,
        externalId: "article-001",
      },
      {
        title: "Personal Portfolio",
        type: "WEBSITE_CREATOR",
        userId: user2.id,
        externalId: "website-001",
      },
    ],
  });

  console.log("⚡ Created executions");

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
