import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";
import { getModelById, MODELS } from "@/models/constants";
import { CreateChatSchema } from "@/models/types";
const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");



const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [

        {
            codeExecution: {}
        }
    ]
})

export async function POST(req: Request) {
    const { prompt } = await req.json()
    try {
        const result = await model.generateContent(prompt);

        return new Response(
            JSON.stringify({
                summary: result.response.text(),
            })
        )
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 400 });

    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    const { success, data } = CreateChatSchema.safeParse(req.body);

    const ConversationId = data?.conversationId;

    if (!success || !ConversationId) {
        return NextResponse.json({
            error: "Incorrect Inputs",
        })
    }

    const model = MODELS.find((model) => model.id == data.model);
    if (!model) {
        return NextResponse.json({
            Error: "Model not supported or not found"
        })
    }

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized user",
        })
    }
    const userid = session.user.id;
    const Getuser = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!Getuser) {
        return NextResponse.json({
            error: "User not found"
        })
    }

    if (!Getuser?.isPremium || model.isPremium) {
        return NextResponse.json({
            error: "Not enough credits",
        })
    }

    const execution = await prisma.execution.findFirst({
        where: {
            id: ConversationId,
            userId: userid,
        }
    })

    if (execution && execution.type !== 'CONVERSATION') {
        return NextResponse.json({
            error: "Conversation exists but owner is differernt"
        })
    }

    if (!execution) {
        await prisma.$transaction([
            prisma.execution.create({
                data: {
                    id: ConversationId,
                    userId: Getuser.id,
                    title: data.message.slice(0, 20) + "...",
                    type: "CONVERSATION",
                    externalId: ConversationId
                }
            }),
            prisma.conversation.create({
                data: {
                    id: ConversationId,
                }
            })
        ])
    }

    if(Getuser.credits <= 0) { 
        return NextResponse.json({
            message:"Insufficient credits ",
        })
    }
    





}