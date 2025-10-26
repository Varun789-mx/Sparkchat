"use client"
import { MessageSquare, X, Plus } from "lucide-react";
import { useState } from "react"

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode,setIsDarkMode] = useState(false);
    return <>
        <div className="flex h-screen bg-gray-50  text-gray-900">
            <div className={`${sidebarOpen ? "w-80" : "w-0"} ${isDarkMode?"bg-[#1a1a1a]" : "bg-white"} transition-all duration-300  border-r border-gray-200 flex-col overflow-hidden`}>
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
            </div>
           <div className="flex-1 flex flex-col">
            <div ></div>
           </div>
        </div>

    </>
}