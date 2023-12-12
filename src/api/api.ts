import axios from "axios";
import { ChatResponse } from "./interfaces";
const useLocal = false
const api = useLocal ? 'http://localhost:7243' : 'https://api.altus.titanschedule.com'


export async function converse(uuid:string, message:string, username: string){
    const res = await axios.post(api + "/conversation/chat", {
        uuid, username: username, message
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

export async function getMessages(uuid:string, username: string){
    const res = await axios.post(api + "/conversation/get_messages", {
        uuid, username: username
    })

    return extractNameFromChatResponse(res.data as ChatResponse);
}

export async function getConversations(username: string){
    const res = await axios.post(api + "/conversation/list", {
        username: username
    })

    return res.data.list.map((c: ChatResponse) => extractNameFromChatResponse(c)) as (ChatResponse & {title?: string})[];
}