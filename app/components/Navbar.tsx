"use client";
import { Sidebar, Send, ChevronLeft } from "lucide-react";
import { useCallback, useRef, useState } from "react";
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
  const { messages, sendMessage } = useChatStore();
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
      message: ""
    })
    await sendMessage(currentMessage, model);
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
        <SideChatBar
          SideBar={sidebarOpen}
          setSideBar={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col h-full ">
            {/* for header */}
            <div
              className={`${sidebarOpen ? "w-0 md:w-full " : "w-full"} gap-4 ${isDarkMode ? "bg-[#181818]" : "bg-white"
                } flex justify-start p-4`}
            >
              {sidebarOpen ? "" : <Sidebar />}
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
                <ConversationBox />
              </div>
            </div>
            <div
              className={`w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth rounded-xl px-4 py-3 pr-12 resize-none`}
            >
              <div className={` mx-auto ${sidebarOpen ? "w-0 md:w-3xl" : "max-w-3xl"} `}>
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
