// Generated by https://quicktype.io

export interface ChatResponse {
    account:       string;
    messages:      Message[];
    presentations: never[];
    uuid:          string;
}

export interface Message {
    content: string;
    role:    string;
}
