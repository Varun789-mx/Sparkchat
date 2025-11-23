import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const {id} = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        return NextResponse.json({
            message: "Unauthorized user"
        }, { status: 401 })
    }
    try {
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }, select: {
                messages: true
            }
        })
        if (!conversation) {
            return NextResponse.json({
                message: "No messages found",
            }, { status: 200 })
        }
        return NextResponse.json({
            data:{
                messages:conversation.messages
            },
            success: true,
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal server error",
        }, { status: 500 })
    }
}   