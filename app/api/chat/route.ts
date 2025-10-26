import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


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