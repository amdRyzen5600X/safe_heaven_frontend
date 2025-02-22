import { createResource, createSignal, onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import ChatNavBar from "./chat_nav_bar";
import ChatConversationComponent from "./chat_conversation";
import { getJwtFromCookies } from "../utils";
import { Chats, Message } from "../components/chat";
import { Manager, Socket } from "socket.io-client";
import { createStore } from "solid-js/store";
import createAxiosInstance, { env } from "../api";
import Cookies from "js-cookie";
import { AxiosResponse } from "axios";

export interface Chat {
    id: string,
    name: string,
    messages: Message[],
}

const fetchChats = async (): Promise<Chats[]> => {
    let client = createAxiosInstance(env.BASE_URL);
    const navigate = useNavigate();
    let jwt = Cookies.get("access_token");
    if (jwt === null) {
        navigate("/sign-in", { resolve: true })
        return [];
    }
    let resp: AxiosResponse<Chats[]> = await client.get("/chats")
    return resp.data;
}

const fetchChat = async (chatId: any): Promise<Chat | undefined> => {
    let client = createAxiosInstance(env.BASE_URL);
    if (chatId === null) {
        return undefined;
    }
    let resp: AxiosResponse<Chat> = await client.get(`/chats/${chatId}`)
    return resp.data;

}

const Conversation = () => {
    const [params, setParams] = useSearchParams();
    const [chatId, setChatId] = createSignal(params.id);
    const [socket, setSocket] = createStore<{ socket?: Socket }>({ socket: undefined });
    const [chats, { mutate: mutateChats }] = createResource(fetchChats);
    const [chat, { mutate: mutateChat, refetch: refetchChat }] = createResource(chatId, fetchChat);


    const [message, setMessage] = createSignal<string>("");

    onMount(async () => {
        // TODO: make a resource from that manager
        let manager = new Manager(
            `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`,
            {
                withCredentials: true,
                extraHeaders: { "authorization": `Bearer ${getJwtFromCookies()}` }
            }
        );
        let socket = manager.socket("/");
        socket.on("newMessage", (message: Message) => {
            mutateChat((prev) => {
                if (prev === undefined) {
                    return undefined;
                }
                return {
                    ...prev,
                    messages: [...prev.messages, message],
                };
            })
            mutateChats(prev => {
                if (prev === undefined) {
                    return undefined;
                }
                return prev.map(eachChat => {
                    if (eachChat.id === chat()?.id) {
                        return {
                            ...eachChat,
                            lastMessage: message,
                        };
                    }
                    return eachChat;
                });
            });
        });

        socket.on("newChat", (chat: Chats) => {
            mutateChats(prev => {
                if (prev === undefined) {
                    return [chat];
                }
                return [chat, ...prev];
            })
        });

        setSocket({ socket });
    });

    const select_chat = (id: string | undefined) => {
        setParams({ id: id });
        setChatId(id)
        refetchChat();
    }

    const handleSendMessage = () => {
        const currentMessage = message();
        if (currentMessage.trim() !== "") {
            socket.socket?.emit("sendMessage", { content: currentMessage, chatId: params.id })
            setMessage("");
        }
    };

    return (
        <div class="h-screen bg-gray-900 text-white flex">
            <ChatNavBar chats={chats} select_chat={select_chat} socket={socket} />
            <ChatConversationComponent
                chat={chat}
                handleSendMessage={handleSendMessage}
                setMessage={setMessage}
                message={message}
            />
        </div>
    );
};
export default Conversation;
