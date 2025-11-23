import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"

export async function GET() {
   
    const session = await getServerSession(authOptions);
    if (!session) {
        console.log("Unauthorized user");
        return NextResponse.json({
            message: "unauthorized user",
        }, { status: 401 })
    }
    try {
        const Getdata = await prisma.conversation.findMany({
            where: {
                userId: session.user.id
            }, select: {
                id: true,
                createdAt: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    take: 1,
                    where: {
                        role: 'user'
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })
        if (Getdata.length === 0) {
            return NextResponse.json({
                message: "No Excutions were found",
            }, { status: 200 })
        }
        return NextResponse.json({
            data: Getdata
        })
    } catch (error: any) {
        return NextResponse.json({
            message: `Internal server error ${error.message}`
        }, { status: 500 })
    }
}