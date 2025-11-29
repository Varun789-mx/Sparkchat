import { useChatStore } from "@/hooks/useChatStore";
import { Typing } from "./Typing";
import ReactMarkDown from "react-markdown";
import { useMarkdown } from "../hooks/useMarkdown";
import FirstMessage from "./FirstMessages";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function ConversationBox() {
    const { preprocessMarkdown, markDownComponent } = useMarkdown();
    const isStreaming = useChatStore();
    const [copiedId, setcopiedId] = useState<string | null>(null);
    const messages = useChatStore((state) => state.messages);
    const setcredits = useChatStore((store) => store.setcredits)
    const chatcontainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = chatcontainerRef.current;
        if (container) {
            const isnearBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight <
                100;

            if (isnearBottom) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        setcredits();
    }, [messages])
    const HandleCopy = useCallback(async (content: string, id: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setcopiedId(id);
            setTimeout(() => {
                setcopiedId(null);
            }, 1500);
        } catch (err) {
            console.log("Failed to copy ", err);
        }
    }, []);


    return (
        <div className="h-full w-full flex justify-center overflow-y-auto">
            <div className="w-full max-w-4xl px-2 md:px-4 py-4">
                {messages.length === 0 ? (
                    <FirstMessage />
                ) : (
                    <div className={`w-full flex p-2 flex-col space-y-4`}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex relative ${msg.role === "user"
                                    ? "justify-end "
                                    : "justify-start"
                                    }`}
                            >
                                <div ref={chatcontainerRef} className=" max-w-[95%] md:max-w-[85%]   flex flex-col justify-start gap-2 overflow-y-auto  scroll-auto ">
                                    <div
                                        className={`p-3 md:p-4 flex justify-center  rounded-xl ${msg.role === "user"
                                            ? "bg-gray-700  text-white"
                                            : "bg-transparent-500  text-gray-200"
                                            }`}
                                    >
                                        <div className="overflow-y-auto scroll-auto  ">
                                            {!isStreaming &&
                                                msg.role === "assistant" &&
                                                msg.content.length === 0 ? (
                                                <Typing />
                                            ) : (
                                                <div className=" prose prose-invert prose-sm md:prose-base max-w-none rounded-xl  ">
                                                    <ReactMarkDown
                                                        components={markDownComponent}
                                                    >
                                                        {preprocessMarkdown(msg.content)}
                                                    </ReactMarkDown>
                                                </div>
                                            )}
                                            {msg.role === 'assistant' ?
                                                <div className="flex justify-end"><button className="w-8 h-8 " onClick={() => HandleCopy(msg.content, msg.id)}>
                                                    {copiedId === msg.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</button></div> : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    )
}