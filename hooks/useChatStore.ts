import type { ChatStoreProps } from "@/types/general";
import { create } from "zustand"

export const useChatStore = create<ChatStoreProps>((set) => ({
    conversationId: '',
    message: [],
    conversations: [],
    isLoading: false,

    setConversationId: (id) => {
        set({ conversationId: id });
        localStorage.setItem("conversationId", id);
    },

    setMessages: (message) => set({ message }),

    setConversations: (conversations) => set({ conversations }),

    loadingConversations: async (id: string) => {
        try {
            set({ isLoading: true });
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations/${id}`);
            const data = await response.json();
            if (data.success && data.data && data.data.messages) {
                set({
                    message: data.data.messages,
                    conversationId: id,
                    isLoading: false,
                });
            }
            localStorage.setItem("conversationId", id);
        } catch (error) {
            console.log(error);
            set({ isLoading: false })
        }
    }

}))