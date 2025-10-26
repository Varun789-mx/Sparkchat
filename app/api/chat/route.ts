import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

const model = genai.getGenerativeModel({
    model:"gemini-2.5-flash",
    tools: [
        
        {
            codeExecution: {}
        }
    ]
})

export async function POST(req: Request) {
    const data = await req.json();
    const prompt = data.text || "Randome output";

    const result = await model.generateContent(prompt);

    return new Response(
        JSON.stringify({
            summary: result.response.text(),
        })
    )
}