import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data in dependency order
  await prisma.message.deleteMany();
  await prisma.app.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared existing data");

  // ─── Users ───────────────────────────────────────────────────────────────────

  const hashedPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedPassword,
      isPremium: true,
      credits: 100,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashedPassword,
      isPremium: false,
      credits: 3,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
  });

  console.log("👤 Created users:", alice.email, bob.email);

  // ─── OAuth Accounts ───────────────────────────────────────────────────────────

  await prisma.account.create({
    data: {
      userId: alice.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "google-alice-001",
      access_token: "ya29.mock-access-token-alice",
      token_type: "Bearer",
      scope: "openid email profile",
      id_token: "mock-id-token-alice",
    },
  });

  await prisma.account.create({
    data: {
      userId: bob.id,
      type: "oauth",
      provider: "github",
      providerAccountId: "github-bob-001",
      access_token: "gho_mock-access-token-bob",
      token_type: "Bearer",
      scope: "read:user user:email",
    },
  });

  console.log("🔐 Created OAuth accounts");

  // ─── Conversations ────────────────────────────────────────────────────────────

  const aliceConv1 = await prisma.conversation.create({
    data: { userId: alice.id },
  });

  const aliceConv2 = await prisma.conversation.create({
    data: { userId: alice.id },
  });

  const bobConv1 = await prisma.conversation.create({
    data: { userId: bob.id },
  });

  console.log("💬 Created conversations");

  // ─── Messages ─────────────────────────────────────────────────────────────────

  await prisma.message.createMany({
    data: [
      {
        conversationId: aliceConv1.id,
        role: "user",
        content: "Build me a todo app with React and Tailwind.",
      },
      {
        conversationId: aliceConv1.id,
        role: "assistant",
        content:
          "Sure! Here's a clean todo app with React and Tailwind CSS. It includes add, complete, and delete functionality.",
      },
      {
        conversationId: aliceConv1.id,
        role: "user",
        content: "Can you add local storage persistence?",
      },
      {
        conversationId: aliceConv1.id,
        role: "assistant",
        content:
          "Absolutely! I've updated the app to persist todos in localStorage using a custom useLocalStorage hook.",
      },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: aliceConv2.id,
        role: "user",
        content: "Create a landing page for a SaaS product.",
      },
      {
        conversationId: aliceConv2.id,
        role: "assistant",
        content:
          "Here's a modern SaaS landing page with a hero section, features grid, pricing cards, and a CTA footer.",
      },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: bobConv1.id,
        role: "user",
        content: "Make a simple calculator app.",
      },
      {
        conversationId: bobConv1.id,
        role: "assistant",
        content:
          "Here's a calculator app with basic arithmetic operations, a clean display, and keyboard support.",
      },
    ],
  });

  console.log("✉️  Created messages");

  // ─── Apps ─────────────────────────────────────────────────────────────────────

  await prisma.app.createMany({
    data: [
      {
        userId: alice.id,
        conversationId: aliceConv1.id,
        title: "Todo App",
        name: "todo-app",
        description: "A todo app with localStorage persistence.",
        icon: "✅",
      },
      {
        userId: alice.id,
        conversationId: aliceConv2.id,
        title: "SaaS Landing Page",
        name: "saas-landing",
        description: "Modern landing page with hero, features, and pricing.",
        icon: "🚀",
      },
      {
        userId: bob.id,
        conversationId: bobConv1.id,
        title: "Calculator",
        name: "calculator",
        description: "A simple calculator with keyboard support.",
        icon: "🧮",
      },
    ],
  });

  console.log("📦 Created apps");
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });