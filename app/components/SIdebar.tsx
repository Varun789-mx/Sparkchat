"use client"
import { ExecutionType } from "@/types/general";
import { Sidebar } from "lucide-react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export const Chatlist = () => {
    const [Executions, setExecutions] = useState<ExecutionType[] | []>([]);
    const [show, setshow] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/api/sidebardata`)
            .then((res) => res.json()).then(data => setExecutions(data.data))
            .catch((error) => console.log(error));
    }
        , [])
    return (
        <div>
            <div className="w-1/5 h-screen bg-black">
                <div className={`w-72 bg-[#1a1a1a] border-r border-gray-800 flex flex-col`}>
                    <button className='bg-blue-500 rounded-lg font-bold p-2 m-4' type='button' >
                        Log out
                    </button>
                    <div className={`p-4 border-b bg-gray-800`}>
                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border
                             border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium"
                        >
                            <Plus className="w-2 h-2" />
                            New Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}