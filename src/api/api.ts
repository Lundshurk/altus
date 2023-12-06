import axios from "axios";
import { ChatResponse } from "./interfaces";

export async function converse(uuid:string, message:string){
    const res = await axios.post("http://localhost:80/conversation/chat", {
        uuid, username: "obama", message
    })

    return res.data as ChatResponse;
}

export async function getMessages(uuid:string){
    const res = await axios.post("http://localhost:80/conversation/get_messages", {
        uuid, username: "obama"
    })

    return res.data as ChatResponse;
}