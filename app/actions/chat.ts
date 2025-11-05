"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";


export interface UserRequest {
    MODEL?: string,
    PROMPT?: string,
}

export const GetModelResponse = async ({ MODEL, PROMPT }:UserRequest) => {
    console.log(MODEL,PROMPT);
    const prisma = new PrismaClient();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error(`Unauthorized user please login`);
    }
    const { id } = session.user;
    const getCredits = await prisma.user.findUnique({
        where: {
            id: id,
        }
    })

    if (!getCredits) {
        throw new Error('Credits not found');
    }

    if (getCredits.credits <= 0 || !getCredits.isPremium) {
        throw new Error("User doesn't have credits");
    }
console.log(process.env.OPEN_ROUTER_API_KEY)
    try {
        const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content:PROMPT,
                    },
                ],
            })
        }
        )
        console.log(response,"From backend");
        return {
            success:true,
            response:response.text(),
        }
    } catch (error) {
        throw new Error("Internal server error");
    }
}



const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [
        {
            codeExecution: {}
        }
    ]
})

export async function sendMessage(text: string) {
    try {
        const result = await model.generateContent(text);
        return {
            success: true,
            message: result.response.text(),
        }
    } catch (error) {
        success: false
        error: error
    }
}

