"use client";
import {
  Sidebar,
  Send,
  ChevronLeft,
} from "lucide-react";

import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { Sparkle } from "lucide-react";
import { MODELS } from "@/models/constants";
import { useMarkdown } from "../hooks/useMarkdown";
import ReactMarkDown from "react-markdown";
import SideChatBar from "./SIdebar";
import { conversationsProp, Messagefields, ROLE } from "@/types/general";
import { useChatStore } from "@/hooks/useChatStore";
import { ModelSelector } from "./ModelSelector";
import FirstMessage from "./FirstMessages";
import { Typing } from "./Typing";



export default function Navbar() {
  const [isMessagingLoading, setisMessageLoading] = useState(false);
  const [Executions, setExecutions] = useState<conversationsProp[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setcopied] = useState(false);
  const [loading, setloading] = useState(false);
  const chatcontainerRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((state) => state.message);
  const setMessages = useChatStore((state) => state.setMessages)
  const { preprocessMarkdown, markDownComponent } = useMarkdown();
  const conversationId = useChatStore((state) => state.conversationId);
  const setconversationId = useChatStore((state) => state.setConversationId);
  const [userinput, setuserinput] = useState({
    conversationId: "",
    modelId: "",
    message: "",
  });
  useEffect(() => {
    const existingId = localStorage.getItem("conversationId") || crypto.randomUUID();
    localStorage.setItem("conversationId", existingId)
    setconversationId(existingId);
  }, [])
  const HandleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setcopied(true);
      setTimeout(() => {
        setcopied(false);
      }, 2000);
    } catch (err) {
      console.log("Failed to copy ", err);
    }
  }, []);

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
    const userMessage: Messagefields = {
      id: crypto.randomUUID().toString(),
      role: ROLE.USER,
      content: userinput.message,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    console.log(messages,"From line 76")
    const currentMessage = userinput.message;
    setuserinput((prev) => ({
      ...prev,
      message: "",
      role: ROLE.USER,
      modelId: model,
      conversationId: conversationId,
    }));
    const assistantMessageId = crypto.randomUUID().toString();
    setMessages([
      ...messages,
      {
        id: assistantMessageId,
        role: ROLE.ASSISTANT,
        content: "",
        timestamp: new Date(),
      },
    ]);
    try {
      setIsTyping(true);
      setloading(true);
      setisMessageLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          modelId: model,
          message: currentMessage,
        }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantMessage = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                console.log("Stream complete!");
                break;
              }

              try {
                setloading(false);
                setIsTyping(false);
                setisMessageLoading(false);
                const parsed = JSON.parse(data);
                console.log("Chunk received:", parsed.content); // See each chunk
                assistantMessage += parsed.content;
                setMessages(
                  messages.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: assistantMessage }
                      : msg
                  )
                );
              } catch (e) {
                console.error("Parse error:", e, "Line:", line);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages(
        messages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry an error occured" }
            : msg
        )
      );
    }
  };
  const Handlekeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      Handlesend();
    }
  };


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
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sidebardata`)
      .then((res) => res.json())
      .then((data) => setExecutions(data.data))
      .catch((error) => console.log(error));
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
      <div className="flex h-screen bg-[#111111]  text-gray-200">
        <SideChatBar Executions={Executions} conversationId={conversationId} SideBar={sidebarOpen} setSideBar={setSidebarOpen} />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col h-full ">
            {/* for header */}
            <div
              className={`w-full gap-4 ${isDarkMode ? "bg-[#181818]" : "bg-white"
                } flex justify-start p-4`}
            >
              {sidebarOpen ? (
                <ChevronLeft className="text-gray-200" />
              ) : (
                <Sidebar onClick={() => setSidebarOpen(!sidebarOpen)} />
              )}
              <p
                className="font-light text-gray-200 cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                New chat{" "}
              </p>
              <ModelSelector />
            </div>
            <div className="flex-1  flex flex-col overflow-hidden align-middle bg-black">
              {/* chat messages space  */}
              <div
                ref={chatcontainerRef}
                className="flex flex-1 overflow-y-auto   flex-col items-center py-6"
              >
                <div className="flex md:w-[60%] p-2 justify-center items-center flex-col ">
                  {messages.length === 0 ? (
                    <FirstMessage />
                  ) : (
                    <div className="w-3/4 flex p-2 flex-col space-y-4">
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
                                ? "bg-blue-600  text-white"
                                : "bg-neutral-700 text-gray-200"
                                }`}
                            >
                              <div className="w-full overflow-y-auto scroll-auto ">
                                {loading && msg.role === 'assistant' && msg.content.length === 0 ? <Typing /> : 
                                <div><ReactMarkDown components={markDownComponent}>
                                  {preprocessMarkdown(msg.content)}
                                </ReactMarkDown></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth rounded-xl px-4 py-3 pr-12 resize-none`}
            >
              <div className="max-w-3xl mx-auto">
                <div className="relative  overflow-hidden">
                  <textarea
                    value={userinput.message}
                    onChange={(e) =>
                      setuserinput({ ...userinput, message: e.target.value })
                    }
                    onKeyDown={Handlekeypress}
                    placeholder="Message SparkAi..."
                    rows={1}
                    className={`w-full  overflow-y-auto scroll-smooth crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar-firefox-firefox-firefox-firefox-firefox-firefox-firefox-firefox ${isDarkMode ? "bg-[#181818]" : "bg-gray-100"
                      } border ${isDarkMode ? "border-gray-700" : "border-gray-300"
                      } ${isDarkMode
                        ? "focus:border-blue-500"
                        : "focus:border-blue-400"
                      } rounded-xl px-4  py-3 pr-12 ${isDarkMode ? "text-white" : "text-gray-200"
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
                    disabled={isTyping}
                    className={`absolute right-2 bottom-2 w-8 h-8 m-2 rounded-lg flex items-center align-middle justify-center transition-all ${!isTyping
                      ? "bg-orange-500 hover:bg-orange-700"
                      : `${isDarkMode ? "bg-[#181818]" : "bg-gray-100"
                      } cursor-not-allowed`
                      }`}
                  >
                    <Send
                      className={`w-4 h-4 ${!isTyping ? "text-white" : "text-gray-500"
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

