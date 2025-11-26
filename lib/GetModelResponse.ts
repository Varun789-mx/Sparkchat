"use server"
import type { Message } from "@/types/general";
import systemPrompt from "./systemprompt";
const MAX_TOKEN_ITERATONS = 1000;

export const GetModelResponse = async (
  messages: Message[],
  model: string,
  cb: (chunk: string) => void,
) => {
  return new Promise<void>(async (resolve, reject) => {
    const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({
          model: model || "google/gemini-2.5-flash",
          messages: [{ role: 'system', content: systemPrompt },
          ...messages
          ],
          stream: true,
          max_tokens: 4096
        }),
      });
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = ''

    try {
      let tokenIteration = 0;

      while (true) {
        tokenIteration++; { }
        if (tokenIteration > MAX_TOKEN_ITERATONS) {
          console.log("Max token itterations");
          resolve();
          return;
        }
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const lineEnd = buffer.indexOf('\n');
          if (lineEnd === -1) {
            console.log("Max token itteraton 2");
            break;
          }

          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data == '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                cb(content);
              }
            } catch (e) {
              console.log("Failed to parse SSE data", data, e);
            }
          }
        }
      }
    } finally {
      resolve()
      reader.cancel();
    }
  })
}