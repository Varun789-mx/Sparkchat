"use client";
import { Sidebar, Send, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";
import SideChatBar from "./ChatsSidebar";
import { useChatStore } from "@/hooks/useChatStore";
import { ModelSelector } from "./ModelSelector";
import ConversationBox from "./ConversationBox";
import SendMsg from "./SendMsg";

export default function Navbar() {
  const chatcontainerRef = useRef<HTMLDivElement>(null);

  const setconversationId = useChatStore((state) => state.setConversationId);
  const { messages } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDarkMode = false;



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
    const existingId =
      localStorage.getItem("conversationId") || crypto.randomUUID();
    localStorage.setItem("conversationId", existingId);
    setconversationId(existingId);
  }, []);


  return (
    <>
      <div className="flex h-screen bg-[#111111]  text-gray-200">
        <div><Toaster /></div>
        <SideChatBar SideBar={sidebarOpen} setSideBar={setSidebarOpen} />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col h-full ">
            {/* for header */}
            <div
              className={`w-full gap-4 ${isDarkMode ? "bg-white" : "bg-[#181818]"
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
            <div ref={chatcontainerRef} className="flex-1  overflow-y-auto w-full  flex justify-center ">
              {/* chat messages space  */}
              <ConversationBox />
            </div>
            <div
              className={`w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth rounded-xl px-4 py-3 pr-12 resize-none`}
            >
              <div
                className={` mx-auto max-w-3xl w-full `}
              >
                <SendMsg isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
