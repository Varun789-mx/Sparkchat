"use client"
import { MessageSquare, X, Plus, Sidebar, Send, ChevronLeft } from "lucide-react";
import { useState } from "react"
import type { ExecutionType } from "@/types/general";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Sparkle } from "lucide-react";
import { MODELS } from "@/models/constants"
import { useSession } from "next-auth/react";

export default function Navbar() {
    const session = useSession();
    const [Executions, setExecutions] = useState<ExecutionType[] | []>([]);
    const [showChats, setshowchats] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [userinput, setuserinput] = useState({
        conversationId: "",
        modelId: "",
        message: "",
    })
    
    const Handlesend = async() => {
        if(!userinput.message.trim()) return;
        const model = localStorage.getItem('modelId') || 'google/gemini-2.5-flash';
        let conversationId = localStorage.getItem('conversationId') || "";
        if(!conversationId) { 
            conversationId = crypto.randomUUID();
            localStorage.setItem('conversationId',conversationId);
        }
        setuserinput(prev => ({
            ...prev,
            modelId: model,
            conversationId: conversationId,
        }))
        try { 
       const response =  await fetch(`http://localhost:3000/api/chat`,{
            method:'POST',
            headers:{
            'Content-Type':'application/json',
            },
            body:JSON.stringify({
                conversationId:conversationId,
                modelId:model,
                message:userinput.message
            })
        })
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

       if (reader) {
    let assistantMessage = '';
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                    console.log('Stream complete!');
                    break;
                }
                
                try {
                    const parsed = JSON.parse(data);
                    console.log('Chunk received:', parsed.content); // See each chunk
                    assistantMessage += parsed.content;
                    
                } catch (e) {
                    console.error('Parse error:', e, 'Line:', line);
                }
            }
        }
    }
    
    console.log('Full response length:', assistantMessage.length);
    console.log('Full response:', assistantMessage);
}
    } catch (error) {
        console.error('Fetch error:', error);
    }

    }
    const Handlekeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            Handlesend();
        }
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ASSISTANT',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);


    useEffect(() => {
        fetch(`http://localhost:3000/api/sidebardata`)
            .then((res) => res.json()).then(data => setExecutions(data.data))
            .catch((error) => console.log(error));
    }
        , [])
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    return <>
        <div className="flex h-screen bg-[#111111]  text-gray-200">
            <div className={`${sidebarOpen ? "w-80" : "w-0"} ${isDarkMode ? "bg-[#181818]" : "bg-white"} transition-all duration-300 overflow-hidden flex flex-col border-r ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-orange-300" />
                            <span className="text-orange-300">Spark AI</span>
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className=" p-2 hover:bg-gray-700  text-white rounded-lg">
                            <X className="w-5 h-5 " />
                        </button>
                    </div>
                    <button className="w-full bg-emerald-500 hover:bg-orange-500 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors  ">
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>
                <div className="flex-1 h-[60vh] overflow-hidden p-2">
                    <button className="w-full text-gray-500 flex justify-start" onClick={() => setshowchats(!showChats)}>Chats {showChats ? <ChevronRight /> : <ChevronDown />}</button>
                    <div className={`w-full overflow-y-auto h-[calc(100%-2rem)] space-y-2 pr-2 ${isDarkMode ? "bg-[#181818]" : "bg-white"} `}>
                        {Executions.map((execution) => (
                            <div className="w-full gap-2 p-1" key={execution.id} hidden={!showChats}>
                                <div className={`border-none w-full  p-2 justify-center cursor-pointer hover:bg-gray-700 ${isDarkMode ? "bg-[#181818] text-gray-300" : "bg-white text-gray-800"} rounded-xl`}>{execution.title?.substring(0, 23)}..</div>
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
                                <div className={`text-gray-200 font-medium text-sm`}>{session.data?.user.username?.replace("_", " ")}</div>
                                <div className={`text-gray-500 text-xs`}>Free Plan</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500`} />
                        </button>
                    </div>
                </footer>
            </div>

            <div className="flex-1 flex flex-col">

                <div className="flex-1 flex flex-col">
                    {/* for header */}
                    <div className={`w-full gap-4 ${isDarkMode ? "bg-[#181818]" : "bg-white"} flex justify-start p-4`}>
                        {sidebarOpen ? <ChevronLeft className="text-gray-200" /> : <Sidebar onClick={() => setSidebarOpen(!sidebarOpen)} />}
                        <p className="font-light text-gray-200" onClick={() => setSidebarOpen(!sidebarOpen)}>New chat </p>
                        <ModelSelector />
                    </div>
                    <div className="flex-1 overflow-y-auto  flex justify-center  items-center  align-middle bg-[#181818]">
                        {/* chat messages space  */}
                        <div className="flex-1 overflow-y-auto flex items-center justify-center">

                            <div className="w-3/4  flex justify-center items-center align-middle">
                                {messages.length === 1 && (
                                    <div className="w-3/4 flex p-3 rounded-xl my-auto justify-center items-center  flex-col bg-neutral-800">
                                        <div className="p-4 m-2 rounded-full bg-emerald-400">
                                            <Sparkle className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex justify-center flex-col items-center">
                                            <p className="font-bold text-gray-200 text-4xl"> How can i help you today ?</p>
                                            <p className="text-gray-300 font-sm text-center">Lorem ipsum dolor sit amet consectetur,  labore libero facere mollitia , impedit.</p>
                                        </div>
                                        <div className="w-full flex justify-center gap-5 p-3">
                                            <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                                                <p className="text-lg font-bold  text-white ">Code generation</p>
                                                <p className=" align-middle text-sm font-light text-orange-300">generate code solve bugs and other styling issues</p></div>

                                            <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 "><p className="text-lg font-bold  text-white ">Text summaraization</p>
                                                <p className="align-middle font-light text-sm text-orange-300">create summaries and understand better</p></div>

                                            <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 "><p className="text-lg font-bold  text-white ">Chat</p>
                                                <p className=" align-middle font-light text-sm text-orange-300">Multiple models for better conversation results</p></div>
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                    <div className={`w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth rounded-xl px-4 py-3 pr-12 resize-none`}>
                        <div className="max-w-3xl mx-auto">
                            <div className="relative overflow-hidden">
                                <textarea
                                    value={userinput.message}
                                    onChange={(e) => setuserinput({ ...userinput, message: e.target.value })}
                                    onKeyDown={Handlekeypress}
                                    placeholder="Message SparkAi..."
                                    rows={1}
                                    className={`w-full  overflow-y-auto scroll-smooth crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 crollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar-firefox-firefox-firefox-firefox-firefox-firefox-firefox-firefox ${isDarkMode ? 'bg-[#181818]' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} ${isDarkMode ? 'focus:border-blue-500' : 'focus:border-blue-400'} rounded-xl px-4  py-3 pr-12 ${isDarkMode ? 'text-white' : 'text-gray-200'} placeholder-gray-500 focus:outline-none resize-none transition-colors`}
                                    style={{ minHeight: '52px', maxHeight: '200px', fieldSizing: 'content' } as React.CSSProperties}
                                />
                                <button
                                    onClick={Handlesend}
                                    disabled={isTyping}
                                    className={`absolute right-2 bottom-2 w-8 h-8 m-2 rounded-lg flex items-center align-middle justify-center transition-all ${!isTyping
                                        ? 'bg-orange-500 hover:bg-orange-700'
                                        : `${isDarkMode ? 'bg-[#181818]' : 'bg-gray-100'} cursor-not-allowed`
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

export const ModelSelector = () => {
    const [selectedmodel, setselectedmodel] = useState("");
    const HandleModelSelect = (e: any) => {
        const modelId = e.target.value
        setselectedmodel(modelId)
        localStorage.setItem('modelId', modelId);
    }
    return (
        <select value={selectedmodel} onChange={HandleModelSelect} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-400  scroll-smooth text-sm font-medium focus:outline-none focus:border-gray-600/50 hover:bg-gray-800/70 transition-all cursor-pointer">
            {MODELS.map((opt) => (
                <option
                    key={opt.id}
                    value={opt.id}
                    className="bg-gray-900 text-gray-500"
                >
                    {opt.name} {opt.isPremium ? '👑' : ''}
                </option>
            ))}
        </select>
    );
};