import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import { withAccelerate } from "@prisma/extension-accelerate";

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
        }).withAccelerate({
            cacheStrategy: {
                ttl: 60,  // Cache for 60 seconds
                swr: 120  // Serve stale data for 120 seconds while revalidating
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