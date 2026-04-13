import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  LogOut,
  ChevronFirst,
  Ellipsis,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useChatStore } from "@/hooks/useChatStore";
import toast from "react-hot-toast";

export default function SideChatBar({
  SideBar,
  setSideBar,
}: {
  SideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
}) {
  const session = useSession();
  const [showFooterMenu, setShowFooterMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { setConversationId, conversationId } = useChatStore();
  const credits = useChatStore((state) => state.credits);
  const reset = useChatStore((state) => state.reset);
  const conversations = useChatStore((state) => state.conversations);
  const FetchConversations = useChatStore((state) => state.FetchConversations);
  const loadingConversations = useChatStore((state) => state.loadingConversations);

  useEffect(() => {
    if (conversationId) setConversationId(conversationId);
    FetchConversations();
  }, [conversationId]);

  const DeleteConversation = async (conversationId:string ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete`
        , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
          })
        });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      toast.error("Error chat deletion failed")
    }
  }
  return (
    <aside
      className={`h-screen shrink-0 transition-all duration-200 ${SideBar ? "w-60" : "w-0"
        }`}
    >
      <nav
        className={`h-full flex flex-col bg-[#111111] border-r border-white/8 overflow-hidden ${SideBar ? "w-60" : "w-0"
          }`}
      >
        {/* Header */}
        <div className="p-3 pb-3 border-b border-white/8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-orange-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-[15px] font-medium">Spark AI</span>
            </div>
            <button
              onClick={() => setSideBar(!SideBar)}
              className="p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-colors"
            >
              <ChevronFirst className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => { reset(); FetchConversations(); }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-medium rounded-lg py-2 px-3 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 min-h-0 flex flex-col">
          <p className="px-3 pt-3 pb-1 text-[11px] font-medium tracking-widest uppercase text-white/30">
            Recent
          </p>
          <div className="flex-1 min-h-0 overflow-y-auto px-1.5 py-1 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {conversations.length > 0 ? (
              conversations
                .filter((c) => c.messages.some((m) => m.role === "user"))
                .map((conversation, index) => {
                  const firstUserMessage = conversation.messages.find(
                    (msg) => msg.role === "user"
                  );
                  const isActive = conversation.id === conversationId;
                  const isMenuOpen = activeMenu === conversation.id;
                  return (
                    <div
                      key={index}
                      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${isActive
                          ? "bg-orange-500/10 text-white/85"
                          : "text-white/55 hover:bg-white/6"
                        }`}
                      onClick={() => {
                        if (conversation.id) loadingConversations(conversation.id);
                        setActiveMenu(null);
                      }}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 bg-orange-500 transition-opacity ${isActive ? "opacity-100" : "opacity-50"
                          }`}
                      />
                      <span className="flex-1 text-[13px] truncate">
                        {firstUserMessage?.content}
                      </span>

                      {isMenuOpen ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                             if (firstUserMessage?.id) DeleteConversation(firstUserMessage.id);
                            setActiveMenu(null);
                          }}
                          className="p-0.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(conversation.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/30 hover:text-white/60 hover:bg-white/8 transition-all shrink-0"
                        >
                          <Ellipsis className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
            ) : (
              <p className="text-white/30 text-[13px] text-center mt-6">
                No conversations yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 p-2">
          {showFooterMenu && (
            <button
              onClick={() => { signOut(); reset(); setShowFooterMenu(false); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 mb-1 rounded-lg text-[13px] text-white/40 hover:text-white/65 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              Log out
            </button>
          )}
          <button
            onClick={() => setShowFooterMenu(!showFooterMenu)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/6 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-700 shrink-0 flex items-center justify-center text-[12px] font-medium text-blue-200 overflow-hidden">
              {session.data?.user.image ? (
                <img
                  src={session.data.user.image}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              ) : (
                session.data?.user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-medium text-white/85 truncate">
                {session.data?.user.name?.replace("_", " ")}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-medium bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded">
                  {session.data?.user.ispremium ? "Premium" : "Standard"}
                </span>
                <span className="text-[11px] text-white/35">
                  {credits.toString()} credits
                </span>
              </div>
            </div>
          </button>
        </div>
      </nav>
    </aside>
  );
}