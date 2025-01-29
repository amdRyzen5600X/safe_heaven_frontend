import { createEffect, createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import ChatNavBar from "./chat_nav_bar";
import ChatConversationComponent from "./chat_conversation";

export interface Chat {
    id: string,
    name: string,
    lastMessage: string,
    messages: string[],
}

const Conversation = () => {
    const [params, setParams] = useSearchParams();
    const [chats, setChats] = createSignal([
        { id: "1", name: "Chat 1", lastMessage: "Hello there!", messages: ["Hi!", "How are you?", "I'm good, thanks!"] },
        { id: "2", name: "Chat 2", lastMessage: "How are you?", messages: ["Hey!", "What's up?", "Not much, just chilling."] },
        { id: "3", name: "Chat 3", lastMessage: "See you later!", messages: ["Bye!", "See you!", "Take care!"] },
    ]);

    const [message, setMessage] = createSignal("");
    const [selectedChat, setSelectedChat] = createSignal<string | null>(null);
    const [selectedChatMessages, setSelectedChatMessages] = createSignal<string[]>([]);

    const select_chat = (chatId: string | undefined) => {
        setParams({ id: chatId });
        setSelectedChat(chatId || null);
    };

    onMount(() => {
        select_chat(params.id);
    })

    createEffect(() => {
        let chat_id = selectedChat();
        const chat = chats().find(chat => chat.id === chat_id);
        setSelectedChatMessages(chat ? [...chat.messages] : []);
    });

    const handleSendMessage = () => {
        const currentMessage = message();
        if (currentMessage.trim() !== "") {
            setChats(prev => prev.map(chat => {
                if (chat.id === selectedChat()) {
                    return {
                        ...chat,
                        messages: [...chat.messages, currentMessage],
                        lastMessage: currentMessage
                    };
                }
                return chat;
            }));
            setMessage("");
        }
    };

    return (
        <div class="min-h-screen bg-gray-900 text-white flex">
            <ChatNavBar chats={chats} select_chat={select_chat} />
            <ChatConversationComponent
                handleSendMessage={handleSendMessage}
                setMessage={setMessage}
                message={message}
                selectedChatMessages={selectedChatMessages}
                selectedChat={selectedChat}
            />
        </div>
    );
};
export default Conversation;
