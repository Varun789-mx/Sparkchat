import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MessageSquare,
  Plus,
  LogOut,
  ChevronFirst,
  ChevronLast,
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
    console.log(session.data, "Session data");
  }, [conversations]);

  const UserData = {
    name: session.data?.user.username,
    image: session.data?.user.image,
    isPremium: session.data?.user.ispremium,
  }

  return (
    <aside className={`h-screen border-r border-gray-800 ${SideBar ? "w-full md:w-60" : "w-0"} `}>

      <nav className={`h-full flex flex-col overflow-hidden border-gray-800 shadow-sm  ${SideBar ? "w-full md:w-60" : "w-0"} `}>

        <div className={`p-4 border-b border-gray-800  `}>

          <div className="flex items-center justify-between mb-4">

            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-orange-300" />
              <span className="text-orange-300">Spark AI</span>
            </h1>
            <button
              onClick={() => setSideBar(!SideBar)}
              className=" p-2 hover:bg-gray-700  text-white rounded-lg"
            >
              {SideBar ? <ChevronFirst className="w-5 h-5" /> : <ChevronLast className="w-5 h-5" />}
            </button>
          </div>
          <button
            className={`overflow-hidden w-50  duration-200  p-1.5 bg-orange-500 hover:bg-orange-700 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors  `}
            onClick={() => {
              reset();
              FetchConversations();
            }}
          >
            <Plus className="w-5 h-5 overflow-hidden" />
            New Chat
          </button>
        </div>
        <div className={`flex-1 overflow-hidden p-2  duration-200 w-full`}>
          <button
            className="w-full text-gray-500 flex justify-start"
            onClick={() => {
              setShowChats(!ShowChats);
            }}
          >
            Chats {ShowChats ? <ChevronDown /> : <ChevronRight />}
          </button>
          <div
            className={`w-50 border border-gray-800 p-3 overflow-y-auto flex-1 space-y-2 pr-2 ${Theme ? "bg-[#181818]" : "bg-white"
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
                      className={`border-none w-full  p-2  justify-center cursor-pointer hover:bg-gray-700 ${Theme
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
                      {firstUserMessage?.content?.substring(0, 25) ||
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

        <footer className={`overflow-hidden transition-all w-full`}>
          <div className={`p-3 border-t border-gray-800 flex flex-col w-full `}>
            <div
              hidden={isFooterOpen}
              className="flex justify-start  py-1 transition-all duration-200"
            >
              <button
                onClick={() => {
                  signOut();
                  reset()
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
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {UserData.image ? <img className="rounded-full" src={UserData.image} alt="user" /> : UserData.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left ">
                <div className={`text-gray-200 font-medium text-sm`}>
                  {UserData.name?.replace("_", " ")}
                </div>
                <div
                  className={`text-gray-300 text-xs w-full flex justify-start gap-4  `}
                >
                  {UserData.isPremium ? <p >Free Plan</p> : <p >Premium Plan</p>} <p>Credits:{credits.toString()}</p>
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
      </nav>
    </aside >
  );
}
