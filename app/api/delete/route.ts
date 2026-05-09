import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return Response.json({
                message: "UNAUTHORIZED",
            }, { status: 401 })
        }
        const { conversationId } = await req.json();
        if (!conversationId) {
            return NextResponse.json({
                message: "Missing required params",
            }, {
                status: 400
            })
        }
        await prisma.message.deleteMany({
            where: {
                conversationId: conversationId,
            },
        })
        return Response.json({
            message: "Success",
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({ error: "Failed to Delete the conversation " + error }, { status: 500 })
    }
}