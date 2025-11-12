"use client"
import { useParams } from "next/navigation";
import ChatbotInterface from "../components/All";

import { Chatlist } from "../components/SIdebar";



export default function Chat() {
    const params = useParams();
    const conversationId = params.conversatonId as string;
    return <div>
        {/* <ChatbotInterface conversationId={conversationId} /> */}
       <Chatlist/>
    </div>
}