"use server"
import { prisma } from "./prisma"

export const GetUserCredits = async (Id: string): Promise<number> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Id,
            }, select: {
                credits: true
            }
        })
        return user?.credits || 0;

    } catch (error) {
        console.log(error);
        return 0;
    }
}