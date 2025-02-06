export interface Message {
    id?: number,
    content: string,
    senderUsername: string,
}

export interface Chat {
    id: string,
    name: string,
    lastMessage?: Message,
    messages: Message[],
}

const ChatComponent = (props: { chat: Chat, select_chat: (id: string) => void}) => {
    return (
        <div
            class="p-4 bg-gray-700 rounded-lg shadow-md cursor-pointer hover:bg-gray-600 transition-colors duration-200"
            onClick={() => props.select_chat(props.chat.id)}
        >
            <h2 class="text-lg font-semibold">{props.chat.name}</h2>
            <p class="text-xs text-gray-300">{props.chat.lastMessage?.content}</p>
        </div>
    );
};

export default ChatComponent;
