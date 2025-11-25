"use client";
import {
  MessageSquare,
  X,
  Plus,
  Sidebar,
  Send,
  ChevronLeft,
  LogOut,
} from "lucide-react";

import { useCallback, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Sparkle } from "lucide-react";
import { MODELS } from "@/models/constants";
import { signOut, useSession } from "next-auth/react";
import { useMarkdown } from "../hooks/useMarkdown";
import ReactMarkDown from "react-markdown";

interface Messagefields {
  id: number | string;
  conversationId?: string,
  role: string;
  content: string;
  timestamp: Date;
}
interface conversationsProp {
  id: string,
  createdAt: string,
  messages: Messagefields[]
}
export default function Navbar() {
  const session = useSession();
  const [isfooterOpen,setisfooterOpen] = useState(true);
  const [isMessagingLoading, setisMessageLoading] = useState(false);
  const [Executions, setExecutions] = useState<conversationsProp[]>([]);
  const [showChats, setshowchats] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setcopied] = useState(false);
  const [loading, setloading] = useState(false);
  const chatcontainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Messagefields[]>([]);
  const { preprocessMarkdown, markDownComponent } = useMarkdown();
  const [conversationId, setconversationId] = useState("");
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
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userinput.message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = userinput.message;
    setuserinput((prev) => ({
      ...prev,
      message: "",
      modelId: model,
      conversationId: conversationId,
    }));
    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
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
                setMessages((prev) =>
                  prev.map((msg) =>
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
      setMessages((prev) =>
        prev.map((msg) =>
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

  const fetchConversations = async (conversationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations/${conversationId}`)

      const data = await response.json();
      if (data.success && data.data && data.data.messages) {
        setMessages(data.data.messages)
        setconversationId(conversationId);
        localStorage.setItem("conversationId", conversationId)
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (conversationId) fetchConversations(conversationId);
  }, [conversationId])
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
        <div
          className={`${sidebarOpen ? "w-full md:w-80" : "w-0"} ${isDarkMode ? "bg-[#181818]" : "bg-white"
            } ${sidebarOpen ? "" : ""} transition-all duration-300 overflow-hidden flex flex-col border-r ${isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
        >
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-300" />
                <span className="text-orange-300">Spark AI</span>
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className=" p-2 hover:bg-gray-700  text-white rounded-lg"
              >
                <X className="w-5 h-5 " />
              </button>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-700 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors  " onClick={() => localStorage.removeItem("conversationId")}>
              <Plus className="w-5 h-5" />
              New Chat 
            </button>
          </div>
          <div className="flex-1 h-[60vh] overflow-hidden p-2">
            <button
              className="w-full text-gray-500 flex justify-start"
              onClick={() => setshowchats(!showChats)}
            >
              Chats {showChats ? <ChevronDown /> : <ChevronRight />}
            </button>
            <div
              className={`w-full overflow-y-auto h-[calc(100%-2rem)] space-y-2 pr-2 ${isDarkMode ? "bg-[#181818]" : "bg-white"
                } `}
            >
              {Executions ? Executions.map((execution, index) => {

                const firstUserMessage = execution.messages.find((msg) => msg.role === 'user')
                return (
                  <div
                    className="w-full gap-2 p-1"
                    key={index}
                    hidden={!showChats}
                  >
                    <div
                      className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${isDarkMode
                        ? "bg-[#181818] text-gray-300"
                        : "bg-white text-gray-800"
                        } rounded-xl`}
                      onClick={() => {
                        console.log(execution, "From exeecution")
                        const convid = execution.id;
                        if (convid) {
                          fetchConversations(convid)
                        } else {
                          console.log("No conversationId")
                        }

                      }}
                    >
                      {firstUserMessage?.content?.substring(0, 28) || "New Conversation"}..
                    </div>
                  </div>
                )
              }) : <p className="text-gray-500 text-center mt-4 ">No conversations yet</p>}
            </div>
          </div>
          <footer>
            <div className={`p-3 border-t border-gray-800`}>
              <div hidden={isfooterOpen} className="flex  justify-start  py-1"><button onClick={()=>signOut()} className="bg-gray-800  w-2/3 flex justify-start gap-3 p-2 rounded-lg text-sm hover:bg-gray-700"><LogOut className="w-8 h-5"/>Log out</button></div>
              <button
              onClick={()=>setisfooterOpen(!isfooterOpen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 transition-colors`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {session.data?.user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left ">
                  <div className={`text-gray-200 font-medium text-sm`}>
                    {session.data?.user.username?.replace("_", " ")}
                  </div>
                  <div className={`text-gray-500 text-xs flex justify-start gap-4  `}>Free Plan <p>Credits: {session.data?.user.credits?.toString()}</p></div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500`} />
              </button>
            </div>
          </footer>
        </div>

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
            <div className="flex-1 flex flex-col overflow-hidden align-middle bg-black">
              {/* chat messages space  */}
              <div
                ref={chatcontainerRef}
                className="flex flex-1 overflow-y-auto   flex-col items-center py-6"
              >
                <div className=" w-3/4 md:w-2/4 flex p-3 rounded-xl justify-center items-center flex-col ">
                  {isMessagingLoading ? (<div></div>) : ("")}
                  {messages.length === 0 ? (
                    <div className=" flex p-3 rounded-xl my-auto justify-center items-center  flex-col bg-neutral-800">
                      <div className="p-4 m-2 rounded-full bg-emerald-400">
                        <Sparkle className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex justify-center flex-col items-center">
                        <p className="font-bold text-gray-200 text-2xl md:4xl">
                          {" "}
                          How can i help you today ?
                        </p>
                        <p className="text-gray-300 font-sm text-center">
                          Choose various models to get your desired output
                        </p>
                      </div>
                      <div className="w-full flex justify-center gap-5 p-3">
                        <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                          <p className="text-lg font-bold  text-white ">
                            Code generation
                          </p>
                          <p className=" align-middle text-sm font-light text-orange-300">
                            generate code solve bugs and other styling issues
                          </p>
                        </div>

                        <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                          <p className="text-lg font-bold  text-white ">
                            Text summaraization
                          </p>
                          <p className="align-middle font-light text-sm text-orange-300">
                            create summaries and understand better
                          </p>
                        </div>

                        <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                          <p className="text-lg font-bold  text-white ">Chat</p>
                          <p className=" align-middle font-light text-sm text-orange-300">
                            Multiple models for better conversation results
                          </p>
                        </div>
                      </div>
                    </div>
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
                                ? "bg-blue-600  text-white"
                                : "bg-neutral-700 text-gray-200"
                                }`}
                            >
                              <div className="w-full overflow-y-auto scroll-auto ">
                                {loading && msg.role === 'assistant' || msg.content.length === 0 ? <div className="flex gap-1">
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                                    style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                                    style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                                    style={{ animationDelay: '300ms' }}></div>
                                </div> : <div><ReactMarkDown components={markDownComponent}>
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

export const ModelSelector = () => {
  const [selectedmodel, setselectedmodel] = useState("");

  const HandleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    setselectedmodel(modelId);
    localStorage.setItem("modelId", modelId);
  };

  useEffect(() => {
    const SavedModel = localStorage.getItem("modelId");
    if (SavedModel) {
      setselectedmodel(SavedModel);
    } else {
      const DefaultModel = "google/gemini-2.5-flash";
      setselectedmodel(DefaultModel);
      localStorage.setItem("modelId", DefaultModel);
    }
  }, [selectedmodel])
  return (
    <select
      value={selectedmodel}
      onChange={HandleModelSelect}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-400  scroll-smooth text-sm font-medium focus:outline-none focus:border-gray-600/50 hover:bg-gray-800/70 transition-all cursor-pointer"
    >
      {MODELS.map((opt) => (
        <option
          key={opt.id}
          value={opt.id}
          className="bg-gray-900 text-gray-500"
        >
          {opt.name} {opt.isPremium ? "👑" : ""}
        </option>
      ))}
    </select>
  );
};