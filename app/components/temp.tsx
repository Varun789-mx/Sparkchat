"use client"
import { ExecutionType } from "@/types/general";
import { ChevronDown, ChevronRight, Sidebar } from "lucide-react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
export const Chatlist = () => {
    const session = useSession();
    const [Executions, setExecutions] = useState<ExecutionType[] | []>([]);
    const [show, setshow] = useState(false);
    const [showChats, setshowchats] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/api/sidebardata`)
            .then((res) => res.json()).then(data => setExecutions(data.data))
            .catch((error) => console.log(error));
    }
        , [])
    return (
        <div>
            <div className="w-1/5 h-screen bg-black">
                <div className={`w-72 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full`}>

                    <div className={`w-full  border-b bg-gray-800 p-3`}>
                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border
                             border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium"
                            onClick={() => signOut()}>
                            <Plus className="w-5 h-5" />
                            New Chat
                        </button>
                    </div>
                    <br />
                    <div className="flex-1 overflow-hidden p-2">
                        <button className="w-full text-gray-500 flex justify-start" onClick={() => setshowchats(!showChats)}>Chats {showChats ? <ChevronRight /> : <ChevronDown />}</button>
                        <div className="w-full overflow-y-auto h-[calc(100%-2rem)] space-y-2 pr-2 bg-gray-900">
                            {Executions.map((execution) => (
                                <div className="w-full gap-2 p-1" key={execution.id} hidden={showChats}>
                                    <div className="border-none w-full text-gray-300 p-2 justify-center cursor-pointer hover:bg-gray-700 bg-gray-800  rounded-xl">{execution.title?.substring(0, 23)}..</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`p-3 border-t border-gray-800`}>
                        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 transition-colors`}>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                {session.data?.user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left ">
                                <div className={`text-gray-900 font-medium text-sm`}>{session.data?.user.name?.replace("_", " ")}</div>
                                <div className={`text-gray-500 text-xs`}>Free Plan</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}