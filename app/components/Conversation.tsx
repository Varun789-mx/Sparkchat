import { useState } from "react"
import type { Message } from "@/types/general";
import { Sparkle } from "lucide-react";

export const Conversation = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ASSISTANT',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    return <div>
        {messages.length === 1 && (
            <div>
                <div>
                    {messages.map((msg) => (
                        <div>
                            {msg.role === 'ASSISTANT' && (
                                <div>
                                    <Sparkle className="bg-blue-500" />
                                    <p>How can i help you</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}