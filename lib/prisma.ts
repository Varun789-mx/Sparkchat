import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaAccelerate = new PrismaClient().$extends(withAccelerate());
export type AcceleratePrismaClient = typeof prismaAccelerate;

const globalForprisma = globalThis as unknown as {
    prisma: AcceleratePrismaClient | undefined
}

export const prisma: AcceleratePrismaClient = globalForprisma.prisma ?? new PrismaClient({
    log: ['error'],
}).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') {
    globalForprisma.prisma = prisma as any
}   