import { useChatStore } from "@/hooks/useChatStore";
import { Typing } from "./Typing";
import ReactMarkDown from "react-markdown";
import { useMarkdown } from "../hooks/useMarkdown";
import FirstMessage from "./FirstMessages";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function ConversationBox() {
    const { preprocessMarkdown, markDownComponent } = useMarkdown();
    const isStreaming = useChatStore();
    const [copiedId, setcopiedId] = useState<string | null>(null);
    const messages = useChatStore((state) => state.messages);
    const setcredits = useChatStore((store) => store.setcredits)


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
        <div className="flex md:w-[70%] p-2 justify-center items-center flex-col ">
            {messages.length === 0 ? (
                <FirstMessage />
            ) : (
                <div className="w-full flex p-2 flex-col space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full ${msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div className="message-container  p-2  flex flex-col justify-start gap-2 overflow-y-auto  scroll-auto ">
                                <div
                                    className={`w-full p-3 flex justify-center  rounded-xl ${msg.role === "user"
                                        ? "bg-gray-800  text-white"
                                        : "bg-transparent-500 text-gray-00"
                                        }`}
                                >

                                    <div className="w-full overflow-y-auto scroll-auto ">
                                        {!isStreaming &&
                                            msg.role === "assistant" &&
                                            msg.content.length === 0 ? (
                                            <Typing />
                                        ) : (
                                            <div>
                                                <ReactMarkDown
                                                    components={markDownComponent}

                                                >
                                                    {preprocessMarkdown(msg.content)}
                                                </ReactMarkDown>
                                            </div>
                                        )}
                                        {msg.role === 'assistant' ?
                                            <div className="flex justify-end"><button className="w-8 h-8 " onClick={() => HandleCopy(msg.content, msg.id)}>
                                                {copiedId === null ? <Copy className="w-4 h-4" /> : <Check className="w-4 h-4 text-green-500" />}</button></div> : ""}

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}