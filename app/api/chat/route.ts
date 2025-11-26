"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getModelById, MODELS } from "@/models/constants";
import { ROLE } from "@/types/general";
import { InMemoryStore } from "@/lib/InMemoryStore";
import { GetModelResponse } from "@/lib/GetModelResponse";
const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

const model = genai.getGenerativeModel({
  model: "gemini-2.5-flash",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

// export async function POST(req: Request) {
//   const { prompt } = await req.json();
//   try {
//     const result = await model.generateContent(prompt);

//     return new Response(
//       JSON.stringify({
//         summary: result.response.text(),
//       })
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message || "Something went wrong" },
//       { status: 400 }
//     );
//   }
// }

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { conversationId, modelId, message } = await req.json();

  if (!conversationId || !modelId || !message) {
    return NextResponse.json(
      {
        message: "Missing required params:",
      },
      { status: 400 }
    );
  }

  const Selectedmodel = getModelById(modelId);
  if (!Selectedmodel) {
    return NextResponse.json({
      Error: "Model not supported or not found",
    });
  }

  if (!session?.user.id) {
    return NextResponse.json(
      {
        error: "Unauthorized user",
      },
      { status: 401 }
    );
  }
  const userid = session.user.id;
  const Getuser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!Getuser) {
    return NextResponse.json(
      {
        error: "User not found",
      },
      { status: 404 }
    );
  }
  if (Selectedmodel.isPremium && !Getuser.isPremium) {
    return NextResponse.json(
      {
        error: "Premium model request ,Please subscribe for premium models",
      },
      { status: 403 }
    );
  }

  if (Getuser.credits <= 0) {
    return NextResponse.json(
      {
        error: "Insufficient credits",
      },
      { status: 402 }
    );
  }

  const execution = await prisma.execution.findFirst({
    where: {
      id: conversationId,
      userId: userid,
    },
  });

  if (execution && execution.type !== "CONVERSATION") {
    return NextResponse.json(
      {
        error: "Conversation exists but owner is differernt",
      },
      { status: 408 }
    );
  }

  if (!execution) {
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    await prisma.$transaction([
      prisma.execution.create({
        data: {
          id: conversationId,
          userId: Getuser.id,
          title: message.slice(0, 20) + "...",
          type: "CONVERSATION",
          externalId: conversationId,
        },
      }),
      !existingConversation ?
        prisma.conversation.create({
          data: {
            id: conversationId,
            userId: session.user.id
          },
        }) : prisma.$executeRaw`SELECT 1`
    ]);
  }

  let existingMessages = InMemoryStore.getInstance().get(conversationId);

  if (!existingMessages.length) {
    const dbmessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    dbmessages.map((msg) => {
      InMemoryStore.getInstance().add(conversationId, {
        role: msg.role as ROLE,
        content: msg.content,
      });
    });
    existingMessages = InMemoryStore.getInstance().get(conversationId);
  }

  InMemoryStore.getInstance().add(conversationId, {
    role: ROLE.USER,
    content: message,
  });

  const allmessages = InMemoryStore.getInstance().get(conversationId);
  let fullresponse = "";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await GetModelResponse(
          allmessages,
          Selectedmodel.id,
          (chunk: string) => {
            fullresponse += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            );
          }
        );
        InMemoryStore.getInstance().add(conversationId, {
          role: ROLE.ASSISTANT,
          content: fullresponse,
        });
        await prisma.$transaction([
          prisma.message.createMany({
            data: [
              {
                conversationId: conversationId,
                role: "user",
                content: message,
              },
              {
                conversationId: conversationId,
                role: "assistant",
                content: fullresponse,
              },
            ],
          }),
          prisma.user.update({
            where: { id: userid },
            data: { credits: { decrement: 1 } },
          }),
        ]);
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (error: any) {
        console.log("Stream Error", error);
        controller.enqueue(
          encoder.encode(`data:${JSON.stringify({ error: error.message })}\n\n`)
        );
        controller.error(error);
      } finally {
        await prisma.$disconnect();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  });
}
