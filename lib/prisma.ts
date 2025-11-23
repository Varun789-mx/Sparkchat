import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForprisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForprisma.prisma ?? new PrismaClient({
    log: ['error'],
}).$extends(withAccelerate())

if(process.env.NODE_ENV !== 'production') { 
    globalForprisma.prisma = prisma as any
}