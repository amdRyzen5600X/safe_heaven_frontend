export interface Message {
    id?: number,
    content: string,
    senderUsername: string,
}

export interface Chats {
    id: string,
    name: string,
    lastMessage?: Message,
}

const ChatComponent = (props: { chat: Chats; select_chat: (id: string) => void }) => {
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
