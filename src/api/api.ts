import axios from "axios";
import { ChatResponse } from "./interfaces";

export async function converse(uuid:string, message:string){
    const res = await axios.post("http://localhost:80/conversation/chat", {
        uuid, username: "obama", message
    })


    return extractNameFromChatResponse(res.data);
}

function extractNameFromChatResponse(chatResponse: ChatResponse) {
    const conv = Object.assign({}, chatResponse) as ChatResponse & {title?: string}
    const regex = /\$\$ CONVERSATION_NAME: ([^>]+) \$\$/;
    const match = conv.messages[1].content.match(regex);
    
    conv.title = match ? match[1] : undefined;

    conv.messages[1].content = conv.messages[1].content.replace(regex, "").trim()

    console.log(conv.messages[1].content)

    return conv;
}

export async function getMessages(uuid:string){
    const res = await axios.post("http://localhost:80/conversation/get_messages", {
        uuid, username: "obama"
    })

    return extractNameFromChatResponse(res.data as ChatResponse);
}

export async function getConversations(){
    const res = await axios.post("http://localhost:80/conversation/list", {
        username: "obama"
    })

    return res.data.list.map((c: ChatResponse) => extractNameFromChatResponse(c)) as (ChatResponse & {title?: string})[];
}