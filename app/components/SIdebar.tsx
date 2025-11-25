import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, MessageSquare, X, Plus, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { conversationsProp } from "@/types/general";
import { useChatStore } from "@/hooks/useChatStore";

export default function SideChatBar({ Executions, conversationId, SideBar, setSideBar }:
    {
        Executions: conversationsProp[],
        conversationId: string
        SideBar: boolean,
        setSideBar: Dispatch<SetStateAction<boolean>>
    }) {


    const session = useSession();
    const Theme = true;
    const [ShowChats, setShowChats] = useState(true);
    const [isFooterOpen, setisFooterOpen] = useState(true);
    const setConversations = useChatStore((state) => state.loadingConversations)

    useEffect(() => {
        if (conversationId) setConversations(conversationId);
    }, [conversationId])

    return (

        <div
            className={`${SideBar ? "w-full md:w-70" : "w-0"} ${Theme ? "bg-[#181818]" : "bg-white"
                } ${SideBar ? "" : ""} transition-all duration-300 overflow-hidden flex flex-col border-r ${Theme ? "border-gray-800" : "border-gray-200"
                }`}
        >
         
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-orange-300" />
                        <span className="text-orange-300">Spark AI</span>
                    </h1>
                    <button
                        onClick={() => setSideBar(false)}
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
            <div className="flex-1 overflow-hidden p-2">
                <button
                    className="w-full text-gray-500 flex justify-start"
                    onClick={() => setShowChats(!ShowChats)}
                >
                    Chats {ShowChats ? <ChevronDown /> : <ChevronRight />}
                </button>
                <div
                    className={`w-full overflow-y-auto flex-1 space-y-2 pr-2 ${Theme ? "bg-[#181818]" : "bg-white"
                        } `}
                >
                    {Executions ? Executions.map((execution, index) => {

                        const firstUserMessage = execution.messages.find((msg) => msg.role === 'user')
                        return (
                            <div
                                className="w-full gap-2 p-1"
                                key={index}
                                hidden={!ShowChats}
                            >
                                <div
                                    className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${Theme
                                        ? "bg-[#181818] text-gray-300"
                                        : "bg-white text-gray-800"
                                        } rounded-xl`}
                                    onClick={() => {
                                        console.log(execution, "From exeecution")
                                        const convid = execution.id;
                                        if (convid) {
                                            setConversations(convid)
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

            <footer >
                <div className={`p-3 border-t border-gray-800 flex flex-col `}>
                    <div hidden={isFooterOpen} className="flex  justify-start  py-1 transition-all duration-1000">
                        <button onClick={() => signOut()} className="bg-gray-800  w-2/3 flex 
                        justify-start gap-3 p-2 rounded-lg text-sm hover:bg-gray-700">
                            <LogOut className="w-8 h-5" />Log out</button>
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
                            <div className={`text-gray-500 text-xs flex justify-start gap-4  `}>Free Plan <p>Credits: {session.data?.user.credits?.toString()}</p></div>
                        </div>
                        {isFooterOpen ? <ChevronDown className={`w-4 h-4 text-gray-500`} /> : <ChevronUp className={`w-4 h-4 text-gray-500`} />}
                    </button>
                </div>
            </footer>
        </div>
    )
}