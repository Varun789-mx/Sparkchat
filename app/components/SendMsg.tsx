import { useChatStore } from "@/hooks/useChatStore";
import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SendMessage({ isDarkMode }: {
    isDarkMode: boolean
}) {
    const isLoading = useChatStore((state) => state.isLoading);
    const setconversationId = useChatStore((state) => state.setConversationId);
    const conversationId = useChatStore((state) => state.conversationId);
    const { sendMessage, credits } = useChatStore();
    const [userinput, setuserinput] = useState({
        conversationId: "",
        modelId: "",
        message: "",
    });

    const Handlekeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            Handlesend();
        }
    };
    const Handlesend = async () => {
        if (!userinput.message.trim()) return;
        const model = localStorage.getItem("modelId") || "google/gemini-2.5-flash";
        setconversationId(localStorage.getItem("conversationId") || "");
        if (!conversationId) {
            localStorage.setItem("conversationId", conversationId);
        }
        setuserinput((prev) => ({
            ...prev,
            modelId: model,
            conversationId: conversationId,
        }));
        const currentMessage = userinput.message;
        setuserinput({
            modelId: model,
            conversationId: conversationId,
            message: "",
        });
        if (credits <= 0) {
            toast.error("Insufficient Credits")
            return;
        }
        else {
            await sendMessage(currentMessage, model);
        }
    };
    return (
        <div className="relative  overflow-hidden">
            <textarea
                value={userinput.message}
                onChange={(e) =>
                    setuserinput({ ...userinput, message: e.target.value })
                }
                onKeyDown={Handlekeypress}
                placeholder="Message SparkAi..."
                rows={1}
                className={`w-full  overflow-y-auto scroll-smooth crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar-firefox-firefox-firefox-firefox-firefox-firefox-firefox-firefox ${isDarkMode ? "bg-gray-100":"bg-[#181818]"
                    } border ${isDarkMode ? "border-gray-300": "border-gray-700" 
                    } ${isDarkMode
                        ? "focus:border-blue-400"
                        : "focus:border-blue-500"
                    } rounded-xl px-4  py-3 pr-12 ${isDarkMode ?  "text-gray-200":"text-white"
                    } placeholder-gray-500 focus:outline-none resize-none transition-colors`}
                style={
                    {
                        minHeight: "52px",
                        maxHeight: "200px",
                        fieldSizing: "content",
                    } as React.CSSProperties
                }
            />
            <button
                onClick={Handlesend}
                disabled={isLoading}
                className={`absolute right-2 bottom-2 w-8 h-8 m-2 rounded-lg flex items-center align-middle justify-center transition-all ${!isLoading
                    ? "bg-orange-500 hover:bg-orange-700"
                    : `${isDarkMode ? "bg-gray-100" :"bg-[#181818]" 
                    } cursor-not-allowed`
                    }`}
            >
                <Send
                    className={`w-4 h-4 ${!isLoading ? "text-white" : "text-gray-500"
                        }`}
                />
            </button>
        </div>
    )
}