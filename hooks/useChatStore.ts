import { ROLE, type ChatStoreProps, type Messagefields } from "@/types/general";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useChatStore = create<ChatStoreProps>()(
  devtools(
    persist(
      (set, get) => ({
        conversationId: "",
        messages: [],
        conversations: [],
        isLoading: false,
        isStreaming: false,
        error: null,

        setConversationId: (id: string) => {
          set({ conversationId: id }),
            localStorage.setItem("conversationId", id);
        },

        setMessages: (messages) => set({ messages }),

        addMessage: (messages) =>
          set((state) => ({
            messages: [...state.messages, messages],
          })),

        updateLastMessage: (content) =>
          set((state) => ({
            messages: state.messages.map((msg, idx) =>
              idx === state.messages.length - 1
                ? { ...msg, content: msg.content + content }
                : msg
            ),
          })),

        setConversations: (conversations) => set({ conversations }),

        loadingConversations: async (id) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations/${id}`
            );
            const data = await response.json();

            if (data.success && data.data.messages) {
              set({
                messages: data.data.messages,
                conversationId: id,
              });
              localStorage.setItem("conversationId", id);
            }
          } catch (error) {
            console.log(error);
            set({ error: "Failed to load messages" });
          } finally {
            set({ isLoading: false });
          }
        },
        FetchConversations: async () => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sidebardata`
            );
            const data = await response.json();
            set({ conversations: data.data || [] });
          } catch (error) {
            console.log(error);
          }
        },
        sendMessage: async (message: string, modelId) => {
          if (!message.trim()) return;

          const state = get();
          let currentConversationId = state.conversationId;
          if (!currentConversationId) {
            currentConversationId = crypto.randomUUID();
            set({ conversationId: currentConversationId });
            localStorage.setItem("conversationId", currentConversationId);
          }

          const UserMessage: Messagefields = {
            id: crypto.randomUUID(),
            conversationId: currentConversationId,
            role: ROLE.USER,
            content: message,
            timestamp: new Date(),
          };
          set((state) => ({
            messages: [...state.messages, UserMessage],
          }));
          const assistantMessageId = crypto.randomUUID();
          const assistantMessage = {
            id: assistantMessageId,
            conversationId: currentConversationId,
            role: ROLE.ASSISTANT,
            content: "",
            timestamp: new Date(),
          };
          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isStreaming: true,
            error: null,
          }));
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  conversationId: currentConversationId,
                  modelId,
                  message,
                }),
              }
            );
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (reader) {
              let assistantMessage = "";
              while (true) {
                const { done, value } = await reader.read();
                if (done) return;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const data = line.slice(6);

                    if (data === "[DONE]") {
                      console.log("Stream completed");
                      break;
                    }
                    try {
                      const parsed = JSON.parse(data);
                      assistantMessage += parsed.content;
                      set((state) => ({
                        messages: state.messages.map((msg) =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: assistantMessage }
                            : msg
                        ),
                      }));
                    } catch (error) {
                      console.log("Error", error);
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.log("fetch error", error);
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: "An error occured while fetching" }
                  : msg
              ),
              error: "failed to sendm message",
            }));
          } finally {
            set({ isStreaming: false });
          }
        },
        reset: () => {
          const newId = crypto.randomUUID();
          set({
            conversationId: newId,
            messages: [],
            error: null,
          });
          localStorage.setItem("conversationId", newId);
        },
      }),
      { name: "Chat-storage" }
    )
  )
);
