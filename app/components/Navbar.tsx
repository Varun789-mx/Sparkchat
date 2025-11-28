"use client";
import { Sidebar, Send, ChevronLeft } from "lucide-react";
import {  useRef, useState } from "react";
import {toast, Toaster} from "react-hot-toast";
import { useEffect } from "react";
import SideChatBar from "./SIdebar";
import { useChatStore } from "@/hooks/useChatStore";
import { ModelSelector } from "./ModelSelector";
import ConversationBox from "./ConversationBox";

export default function Navbar() {
  const [isTyping, setIsTyping] = useState(false);

  const chatcontainerRef = useRef<HTMLDivElement>(null);
  const conversationId = useChatStore((state) => state.conversationId);
  const setconversationId = useChatStore((state) => state.setConversationId);
  const { messages, sendMessage, credits } = useChatStore();
  const [userinput, setuserinput] = useState({
    conversationId: "",
    modelId: "",
    message: "",
  });
  useEffect(() => {
    const existingId =
      localStorage.getItem("conversationId") || crypto.randomUUID();
    localStorage.setItem("conversationId", existingId);
    setconversationId(existingId);
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
    const currentMessage = userinput.message;
    setuserinput({
      modelId: model,
      conversationId: conversationId,
      message: "",
    });
    if (credits > 0) {
      toast.error("Insufficient Credits")
      return;
    }
    else {
 await sendMessage(currentMessage, model);
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
      <div className="flex h-screen bg-[#111111]  text-gray-200">
      <div><Toaster/></div>
        <SideChatBar SideBar={sidebarOpen} setSideBar={setSidebarOpen} />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col h-full ">
            {/* for header */}
            <div
              className={`w-full gap-4 ${
                isDarkMode ? "bg-[#181818]" : "bg-white"
              } flex justify-start items-center p-4`}
            >
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-700 p-2 rounded-lg transition-colors ">
              {sidebarOpen ? "" : <Sidebar />} </button>
              <p
                className="font-light text-gray-200 cursor-pointer"
                
              >
                New chat{" "}
              </p>
              <ModelSelector />
            </div>
            <div  ref={chatcontainerRef} className="flex-1  overflow-y-auto w-full  flex justify-center ">
              {/* chat messages space  */}
                <ConversationBox />
            </div>
            <div
              className={`w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth rounded-xl px-4 py-3 pr-12 resize-none`}
            >
              <div
                className={` mx-auto max-w-3xl w-full `}
              >
                <div className="relative  overflow-hidden">
                  <textarea
                    value={userinput.message}
                    onChange={(e) =>
                      setuserinput({ ...userinput, message: e.target.value })
                    }
                    onKeyDown={Handlekeypress}
                    placeholder="Message SparkAi..."
                    rows={1}
                    className={`w-full  overflow-y-auto scroll-smooth crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar-firefox-firefox-firefox-firefox-firefox-firefox-firefox-firefox ${
                      isDarkMode ? "bg-[#181818]" : "bg-gray-100"
                    } border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } ${
                      isDarkMode
                        ? "focus:border-blue-500"
                        : "focus:border-blue-400"
                    } rounded-xl px-4  py-3 pr-12 ${
                      isDarkMode ? "text-white" : "text-gray-200"
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
                    className={`absolute right-2 bottom-2 w-8 h-8 m-2 rounded-lg flex items-center align-middle justify-center transition-all ${
                      !isTyping
                        ? "bg-orange-500 hover:bg-orange-700"
                        : `${
                            isDarkMode ? "bg-[#181818]" : "bg-gray-100"
                          } cursor-not-allowed`
                    }`}
                  >
                    <Send
                      className={`w-4 h-4 ${
                        !isTyping ? "text-white" : "text-gray-500"
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
