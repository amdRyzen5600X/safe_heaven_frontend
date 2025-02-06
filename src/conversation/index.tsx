import { createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import ChatNavBar from "./chat_nav_bar";
import ChatConversationComponent from "./chat_conversation";
import { getJwtFromCookies } from "../utils";
import { Chat, Message } from "../components/chat";

const Conversation = () => {
    const [params, setParams] = useSearchParams();
    const [chats, setChats] = createSignal<Chat[]>([]);


    const [message, setMessage] = createSignal<string>("");
    const [selectedChat, setSelectedChat] = createSignal<Chat | null>(null);
    const [selectedChatMessages, setSelectedChatMessages] = createSignal<Message[]>([]);

    onMount(async () => {
        let resp = await fetch(
            "http://127.0.0.1:3000/chats",
            {
                method: "GET",
                headers: {
                    authorization: `Bearer ${getJwtFromCookies()}`,
                }
            }
        )
        let retrievedChats: Chat[] = await resp.json();

        setChats(retrievedChats);

        setSelectedChat(chats().find((chat) => chat.id === params.id) || null);
    });

    //createEffect(() => {
    //    let prev_chat = selectedChat();
    //    const chat = chats().find(chat => chat.id === prev_chat?.id);
    //    setSelectedChatMessages(chat ? [...chat.messages] : []);
    //});

    const handleSendMessage = () => {
        const currentMessage = message();
        if (currentMessage.trim() !== "") {
            setChats(prev => prev.map(chat => {
                if (chat.id === selectedChat()?.id) {
                    let sentMessage: Message = {
                        senderUsername: "sender",
                        content: currentMessage,
                    }
                    return {
                        ...chat,
                        messages: [...chat.messages, sentMessage],
                        lastMessage: sentMessage,
                    };
                }
                return chat;
            }));
            setMessage("");
        }
    };

    const select_chat = (id: string | undefined) => {
        setParams({ id: id });
        setSelectedChat(chats().find((chat) => chat.id === id) || null);
        let chat = selectedChat();
        setSelectedChatMessages(chat ? [...chat.messages] : []);
    }

    return (
        <div class="h-screen bg-gray-900 text-white flex">
            <ChatNavBar chats={chats} select_chat={select_chat} />
            <ChatConversationComponent
                chatId={params.id}
                handleSendMessage={handleSendMessage}
                setMessage={setMessage}
                message={message}
                selectedChatMessages={selectedChatMessages}
                setSelectedChatMessages={setSelectedChatMessages}
                selectedChat={selectedChat}
            />
        </div>
    );
};
export default Conversation;
