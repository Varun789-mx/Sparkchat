"use client"
import { MessageSquare, X, Plus, Sidebar } from "lucide-react";
import { useState } from "react"
import type { ExecutionType } from "@/types/general";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    return <>
        <div className="flex h-screen bg-gray-50  text-gray-900">
            <div className={`${sidebarOpen ? "w-80" : "w-0"} ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} transition-all duration-300  border-r border-gray-200 flex flex-col overflow-hidden`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-emerald-500" />
                            <span>Spark AI</span>
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className=" p-2 hover:bg-gray-100  rounded-lg">
                            <X className="w-5 h-5 " />
                        </button>
                    </div>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors  ">
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>
                <div className="flex-1 h-[70vh] overflow-hidden p-2">
                    <button className="w-full text-gray-500 flex justify-start" onClick={() => setshowchats(!showChats)}>Chats {showChats ? <ChevronRight /> : <ChevronDown />}</button>
                    <div className={`w-full overflow-y-auto h-[calc(100%-2rem)] space-y-2 pr-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"}`}>
                        {Executions.map((execution) => (
                            <div className="w-full gap-2 p-1" key={execution.id} hidden={showChats}>
                                <div className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${isDarkMode ? "bg-[#1a1a1a] text-gray-300" : "bg-white text-gray-800"} rounded-xl`}>{execution.title?.substring(0, 23)}..</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pt-2" hidden={sidebarOpen}>
                <Sidebar onClick={() => setSidebarOpen(!sidebarOpen)} />
            </div>
            <div className="flex-1 flex flex-col">
                <div>
                </div>
                <div>
                </div>
                <div>
                    <div className="w-full flex justify-center bg-gray-500  items-end">
                        <div className="w-2/3 rounded-lg  bg-blue-400 flex justify-center items-center align-bottom">
                            <textarea className="w-full h-10  bg-black items-center-safe align-bottom " placeholder="your text will be here" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}