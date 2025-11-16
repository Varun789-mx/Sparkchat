"use client"
import { MessageSquare, X, Plus, Sidebar, ArrowBigRight, Send, ChevronLeft, Crown, CrownIcon } from "lucide-react";
import { useState } from "react"
import type { ExecutionType } from "@/types/general";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { MODELS } from "@/models/constants"
import { useSession } from "next-auth/react";

export default function Navbar() {
    const session = useSession();
    const [Executions, setExecutions] = useState<ExecutionType[] | []>([]);
    const [show, setshow] = useState(false);
    const [showChats, setshowchats] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/api/sidebardata`)
            .then((res) => res.json()).then(data => setExecutions(data.data))
            .catch((error) => console.log(error));
    }
        , [])
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
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
                <div className="flex-1 h-[60vhvh] overflow-hidden p-2">
                    <button className="w-full text-gray-500 flex justify-start" onClick={() => setshowchats(!showChats)}>Chats {showChats ? <ChevronRight /> : <ChevronDown />}</button>
                    <div className={`w-full overflow-y-auto h-[calc(100%-2rem)] space-y-2 pr-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"}`}>
                        {Executions.map((execution) => (
                            <div className="w-full gap-2 p-1" key={execution.id} hidden={showChats}>
                                <div className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${isDarkMode ? "bg-[#1a1a1a] text-gray-300" : "bg-white text-gray-800"} rounded-xl`}>{execution.title?.substring(0, 23)}..</div>
                            </div>
                        ))}
                    </div>
                </div>
                <footer>
                    <div className={`p-3 border-t border-gray-800`}>
                        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 transition-colors`}>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                {session.data?.user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left ">
                                <div className={`text-gray-900 font-medium text-sm`}>{session.data?.user.username?.replace("_", " ")}</div>
                                <div className={`text-gray-500 text-xs`}>Free Plan</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500`} />
                        </button>
                    </div>
                </footer>
            </div>
            {/* <div className="pt-2" hidden={sidebarOpen}>
                <Sidebar onClick={() => setSidebarOpen(!sidebarOpen)} />
            </div> */}
            <div className="flex-1 flex flex-col">

                <div className="flex-1 flex flex-col bg-black">
                    {/* for header */}
                    <div className={`w-full gap-5 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} flex justify-start p-4`}>
                        {sidebarOpen ? <ChevronLeft /> : <Sidebar onClick={() => setSidebarOpen(!sidebarOpen)} />}
                        <p className="font-light text-gray-200">New chat </p>
                        <ModelSelector />
                    </div>
                    <div className="flex-1 overflow-y-auto ">
                        {/* chat messages space  */}
                    </div>
                    <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-4`}>
                        <div className="max-w-3xl mx-auto ">
                            <div className="relative">
                                <textarea
                                    // value={input}
                                    // onChange={(e) => setInput(e.target.value)}
                                    // onKeyDown={handleKeyPress}
                                    placeholder="Message SparkAi..."
                                    rows={1}
                                    className={`w-full  overflow-y-auto scroll-smooth no-scrollbar ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} ${isDarkMode ? 'focus:border-blue-500' : 'focus:border-blue-400'} rounded-xl px-4  py-3 pr-12 ${isDarkMode ? 'text-white' : 'text-gray-900'} placeholder-gray-500 focus:outline-none resize-none transition-colors`}
                                    style={{ minHeight: '52px', maxHeight: '200px', fieldSizing: 'content' } as React.CSSProperties}
                                />
                                <button
                                    // onClick={handleSend}
                                    disabled={isTyping}
                                    className={`absolute right-2 bottom-2 w-8 h-8 m-2 rounded-lg flex items-center align-middle justify-center transition-all ${!isTyping
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : `${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100'} cursor-not-allowed`
                                        }`}
                                >
                                    <Send className={`w-4 h-4 ${!isTyping ? 'text-white' : 'text-gray-500'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const ModelSelector = () => {
    const [selectedmodel, setselectedmodel] = useState("");
    const HandleModelSelect = (e: any) => {
       localStorage.setItem("modelid", e.target.value);
       console.log(e.target.value)
        setselectedmodel(e.target.value)
    }
    return (
        <select className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-400  scroll-smooth text-sm font-medium focus:outline-none focus:border-gray-600/50 hover:bg-gray-800/70 transition-all cursor-pointer">
            {MODELS.map((opt) => (
                <option
                    key={opt.id}
                    value={opt.id}
                    onSelect={HandleModelSelect}
                    className="bg-gray-900 text-gray-500"
                >
                    {opt.name} {opt.isPremium ? '👑' : ''}
                </option>
            ))}
        </select>
    );
};