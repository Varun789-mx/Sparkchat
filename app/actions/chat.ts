"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";


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

