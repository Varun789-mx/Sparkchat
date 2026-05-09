"use client"
import { useParams } from "next/navigation";
import Chatbox from "../components/chatbox";



export default function Chat() {
    const params = useParams();
    const conversationId = params.conversatonId as string;
    return (
        <div>
            <Chatbox/>
        </div>

    )
}