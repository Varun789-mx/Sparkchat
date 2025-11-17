"use client"
import { useParams } from "next/navigation";
import ChatbotInterface from "../components/All";

import { Chatlist } from "../components/SIdebar";
import { SessionProvider } from "next-auth/react";
import Chatbox from "../components/chatbox";



export default function Chat() {
    const params = useParams();
    const conversationId = params.conversatonId as string;
    return (
        <div>
            <Chatbox/>
            <ChatbotInterface conversationId={conversationId} />
            {/* <Chatlist /> */}
        </div>

    )
}