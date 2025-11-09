"use client"
import { useParams } from "next/navigation";
import ChatbotInterface from "../components/All";



export default function Chat() {
    const params = useParams();
    const conversationId = params.conversatonId as string;
    return <div>
        <ChatbotInterface conversationId={conversationId} />
    </div>
}