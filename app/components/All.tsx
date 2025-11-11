"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Sparkles, User, Bot, ChevronDown, Sun, Moon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { v4 } from "uuid";
import { useModel } from '@/hooks/useModel';

interface Message {
    id: number;
    role: 'USER' | 'ASSISTANT';
    content: string;
    timestamp: Date;
}

interface AIChatbotProps {
    conversationId?: string;
}

export default function AIChatbot({ conversationId: initialConversationId }: AIChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'ASSISTANT',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [currentResponse, setCurrentResponse] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [conversationId, setConversationId] = useState<string | null>(
        initialConversationId || v4()
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'USER',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);
        setCurrentResponse('');

        try {
            const params = new URLSearchParams({
                modelId: "google/gemini-2.5-flash",
                message: currentInput  // ✅ Send only current message
            });

            // ✅ Only add conversationId if it exists
            if (conversationId) {
                params.append('conversationId', conversationId);
            }
            ``
            const response = await fetch(`/api/chat?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream',
                },
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('Response body is not readable');

            let buffer = '';
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                while (true) {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd === -1) break;

                    const line = buffer.slice(0, lineEnd).trim();
                    buffer = buffer.slice(lineEnd + 1);

                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            const botMessage: Message = {
                                id: Date.now(),
                                role: 'ASSISTANT',
                                content: accumulatedText,
                                timestamp: new Date(),
                            };
                            setMessages(prev => [...prev, botMessage]);
                            setCurrentResponse('');
                            setIsTyping(false);
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);

                            // ✅ Capture conversationId from first message
                            if (parsed.conversationId && !conversationId) {
                                setConversationId(parsed.conversationId);
                            }

                            if (parsed.content) {
                                accumulatedText += parsed.content;
                                setCurrentResponse(accumulatedText);
                            }

                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'ASSISTANT',
                content: `Error: ${error.message || 'An error occurred'}`,
                timestamp: new Date()
            }]);
            setIsTyping(false);
            setCurrentResponse('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNewChat = () => {
        setConversationId(null);
        setMessages([{
            id: 1,
            role: 'ASSISTANT',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }]);
        setCurrentResponse('');
    };

    const suggestedPrompts = [
        "Explain quantum computing",
        "Write a creative story",
        "Help me debug code",
        "Plan a travel itinerary"
    ];

    const handleSignOut = async () => {
        await signOut();
    };

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
                <button className='bg-blue-500 rounded-lg font-bold p-2 m-4' type='button' onClick={handleSignOut}>
                    Log out
                </button>
                <div className={`p-4 border-b ${theme.sidebarBorder}`}>
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2 px-3`}>
                        Today
                    </div>
                    <button className={`w-full text-left px-3 py-2.5 rounded-lg ${theme.chatItemActive} transition-colors ${theme.text} text-sm`}>
                        AI Assistant Conversation
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
                            <h1 className={`${theme.text} font-semibold`}>SparkAi 4o</h1>
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
                                <h2 className={`text-2xl font-semibold ${theme.text} mb-2`}>
                                    How can I help you today?
                                </h2>

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
                                className={`flex gap-3 mb-6 ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'ASSISTANT' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className={`max-w-2xl ${message.role === 'USER' ? 'order-first' : ''}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${message.role === 'USER'
                                                ? `${theme.userMessageBg} text-white`
                                                : `${theme.botMessageBg} ${theme.text}`
                                            }`}
                                    >
                                        <p className="leading-relaxed text-sm">{message.content}</p>
                                    </div>
                                </div>

                                {message.role === 'USER' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-white text-xs font-medium">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Current streaming response */}
                        {currentResponse && (
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className={`max-w-2xl ${theme.botMessageBg} rounded-2xl px-4 py-3`}>
                                    <p className="leading-relaxed text-sm whitespace-pre-wrap">
                                        {currentResponse}
                                        <span className="animate-pulse">▋</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {isTyping && !currentResponse && (
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
                                onKeyDown={handleKeyPress}
                                placeholder="Message SparkAi..."
                                rows={1}
                                className={`w-full ${theme.inputBg} border ${theme.inputBorder} ${theme.inputFocus} rounded-xl px-4 py-3 pr-12 ${theme.text} placeholder-gray-500 focus:outline-none resize-none transition-colors`}
                                style={{ minHeight: '52px', maxHeight: '200px' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className={`absolute right-2 bottom-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${input.trim() && !isTyping
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : `${theme.inputBg} cursor-not-allowed`
                                    }`}
                            >
                                <Send className={`w-4 h-4 ${input.trim() && !isTyping ? 'text-white' : 'text-gray-500'}`} />
                            </button>
                        </div>
                        <p className={`text-center ${theme.textMuted} text-xs mt-2`}>
                            SparkAi can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}