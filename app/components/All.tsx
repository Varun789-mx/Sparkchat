"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Sparkles, User, Bot, ChevronDown, Sun, Moon } from 'lucide-react';
import { sendMessage } from '../actions/chat';

export default function AIChatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);
        try {
            const response = await sendMessage(input);
            console.log(response?.message);
            if (response?.success) {

                const botMessage = {
                    id: messages.length + 2,
                    type: 'bot',
                    content: response?.message,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }
        } catch (error) {
            console.log(error);
            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: `${error}`,
                timestamp: new Date()
            };
            setIsTyping(false);
            setMessages(prev => [...prev, botMessage])
        };
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedPrompts = [
        "Explain quantum computing",
        "Write a creative story",
        "Help me debug code",
        "Plan a travel itinerary"
    ];

    // Theme classes
    const theme = {
        bg: isDarkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50',
        sidebar: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        sidebarBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
        chatBg: isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white',
        header: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        headerBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
        text: isDarkMode ? 'text-white' : 'text-gray-900',
        textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
        chatItemHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
        chatItemActive: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
        inputBg: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100',
        inputBorder: isDarkMode ? 'border-gray-700' : 'border-gray-300',
        inputFocus: isDarkMode ? 'focus:border-blue-500' : 'focus:border-blue-400',
        botMessageBg: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100',
        userMessageBg: isDarkMode ? 'bg-blue-600' : 'bg-blue-500',
        buttonHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200',
        suggestionBg: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        suggestionBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
        suggestionHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    };

    return (
        <div className={`flex h-screen ${theme.bg}`}>
            {/* Sidebar */}
            <div className={`w-72 ${theme.sidebar} border-r ${theme.sidebarBorder} flex flex-col`}>
                {/* Sidebar Header */}
                <div className={`p-4 border-b ${theme.sidebarBorder}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium">
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2 px-3`}>Today</div>
                    <button className={`w-full text-left px-3 py-2.5 rounded-lg ${theme.chatItemActive} transition-colors ${theme.text} text-sm`}>
                        AI Assistant Conversation
                    </button>
                    <button className={`w-full text-left px-3 py-2.5 rounded-lg ${theme.chatItemHover} transition-colors ${theme.textSecondary} text-sm`}>
                        Previous Chat Example
                    </button>

                    <div className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2 mt-4 px-3`}>Yesterday</div>
                    <button className={`w-full text-left px-3 py-2.5 rounded-lg ${theme.chatItemHover} transition-colors ${theme.textSecondary} text-sm`}>
                        Code Debug Session
                    </button>
                    <button className={`w-full text-left px-3 py-2.5 rounded-lg ${theme.chatItemHover} transition-colors ${theme.textSecondary} text-sm`}>
                        Creative Writing Help
                    </button>
                </div>

                {/* User Profile */}
                <div className={`p-3 border-t ${theme.sidebarBorder}`}>
                    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${theme.buttonHover} transition-colors`}>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                            U
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`${theme.text} font-medium text-sm`}>User Name</div>
                            <div className={`${theme.textMuted} text-xs`}>Free Plan</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 ${theme.textMuted}`} />
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className={`h-14 border-b ${theme.headerBorder} ${theme.header} flex items-center justify-between px-4`}>
                    <div className="flex items-center gap-3">
                        <button className={`lg:hidden p-2 ${theme.buttonHover} rounded-lg`}>
                            <Menu className={`w-5 h-5 ${theme.text}`} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h1 className={`${theme.text} font-semibold`}>ChatGPT 4o</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg ${theme.buttonHover} transition-colors`}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={`flex-1 overflow-y-auto ${theme.chatBg}`}>
                    <div className="max-w-3xl mx-auto px-4 py-6">
                        {messages.length === 1 && (
                            <div className="text-center mb-8 mt-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className={`text-2xl font-semibold ${theme.text} mb-2`}>How can I help you today?</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto mt-6">
                                    {suggestedPrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInput(prompt)}
                                            className={`p-3 rounded-lg ${theme.suggestionBg} border ${theme.suggestionBorder} ${theme.suggestionHover} ${theme.text} text-left text-sm transition-colors`}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.type === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className={`max-w-2xl ${message.type === 'user' ? 'order-first' : ''}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                                            ? `${theme.userMessageBg} text-white`
                                            : `${theme.botMessageBg} ${theme.text}`
                                            }`}
                                    >
                                        <p className="leading-relaxed text-sm">{message.content}</p>
                                    </div>
                                </div>

                                {message.type === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-white text-xs font-medium">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className={`${theme.botMessageBg} rounded-2xl px-4 py-3`}>
                                    <div className="flex gap-1">
                                        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className={`border-t ${theme.headerBorder} ${theme.header} p-4`}>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyUp={handleKeyPress}
                                placeholder="Message ChatGPT..."
                                rows={1}
                                className={`w-full ${theme.inputBg} border ${theme.inputBorder} ${theme.inputFocus} rounded-xl px-4 py-3 pr-12 ${theme.text} placeholder-gray-500 focus:outline-none resize-none transition-colors`}
                                style={{ minHeight: '52px', maxHeight: '200px' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`absolute right-2 bottom-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${input.trim()
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : `${theme.inputBg} cursor-not-allowed`
                                    }`}
                            >
                                <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-gray-500'}`} />
                            </button>
                        </div>
                        <p className={`text-center ${theme.textMuted} text-xs mt-2`}>
                            ChatGPT can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}