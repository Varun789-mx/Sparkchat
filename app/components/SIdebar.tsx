import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MessageSquare,
  X,
  Plus,
  LogOut,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useChatStore } from "@/hooks/useChatStore";

export default function SideChatBar({
  SideBar,
  setSideBar,
}: {
  SideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
}) {
  const session = useSession();
  const Theme = true;
  const { setConversationId, conversationId } = useChatStore();
  const credits = useChatStore((state) => state.credits);
  const reset = useChatStore((state) => state.reset);
  const conversations = useChatStore((state) => state.conversations);
  const FetchConversations = useChatStore((state) => state.FetchConversations);
  const loadingConversations = useChatStore(
    (state) => state.loadingConversations
  );
  const [ShowChats, setShowChats] = useState(true);
  const [isFooterOpen, setisFooterOpen] = useState(true);

  useEffect(() => {
    if (conversationId) setConversationId(conversationId);
    FetchConversations();
    console.log(session.data,"Session data");
  }, [conversationId]);

  return (
    <div
      className={`${SideBar ? "w-2/3 md:w-70" : "w-0"} ${
        Theme ? "bg-[#181818]" : "bg-white"
      } 
      } transition-all duration-300 overflow-hidden flex flex-col border-r ${
        Theme ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-300" />
            <span className="text-orange-300">Spark AI</span>
          </h1>
          <button
            onClick={() => setSideBar(!SideBar)}
            className=" p-2 hover:bg-gray-700  text-white rounded-lg"
          >
            <X className="w-5 h-5 " />
          </button>
        </div>
        <button
          className="w-full bg-orange-500 hover:bg-orange-700 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors  "
          onClick={() => {
            reset();
            FetchConversations();
          }}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <button
          className="w-full text-gray-500 flex justify-start"
          onClick={() => {
            setShowChats(!ShowChats);
          }}
        >
          Chats {ShowChats ? <ChevronDown /> : <ChevronRight />}
        </button>
        <div
          className={`w-full overflow-y-auto flex-1 space-y-2 pr-2 ${
            Theme ? "bg-[#181818]" : "bg-white"
          } `}
        >
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => {
              const firstUserMessage = conversation.messages.find(
                (msg) => msg.role === "user"
              );
              return (
                <div
                  className="w-full gap-2 p-1"
                  key={index}
                  hidden={!ShowChats}
                >
                  <div
                    className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${
                      Theme
                        ? "bg-[#181818] text-gray-300 text-sm border-t"
                        : "bg-white text-gray-800"
                    } rounded-xl`}
                    onClick={() => {
                      const convid = conversation.id;
                      if (convid) {
                        loadingConversations(convid);
                      } else {
                        console.log("No conversationId");
                      }
                    }}
                  >
                    {firstUserMessage?.content?.substring(0, 28) ||
                      "New Conversation"}
                    ..
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center mt-4 ">
              No conversations yet
            </p>
          )}
        </div>
      </div>

      <footer>
        <div className={`p-3 border-t border-gray-800 flex flex-col `}>
          <div
            hidden={isFooterOpen}
            className="flex  justify-start  py-1 transition-all duration-1000"
          >
            <button
              onClick={() => {
                signOut();
                setisFooterOpen(!isFooterOpen);
              }}
              className="bg-gray-800  w-2/3 flex 
                        justify-start gap-3 p-2 rounded-lg text-sm hover:bg-gray-700"
            >
              <LogOut className="w-8 h-5" />
              Log out
            </button>
          </div>
          <button
            onClick={() => setisFooterOpen(!isFooterOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 transition-colors`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {session.data?.user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left ">
              <div className={`text-gray-200 font-medium text-sm`}>
                {session.data?.user.username?.replace("_", " ")}
              </div>
              <div
                className={`text-gray-300 text-xs flex justify-start gap-4  `}
              >
                Free Plan <p>Credits: {credits.toString()}</p>
              </div>
            </div>
            {isFooterOpen ? (
              <ChevronDown className={`w-4 h-4 text-gray-500`} />
            ) : (
              <ChevronUp className={`w-4 h-4 text-gray-500`} />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
