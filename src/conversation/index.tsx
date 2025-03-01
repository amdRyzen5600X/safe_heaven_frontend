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

export interface ChatStatus {
    confirmed: boolean,
    chatId: string,
    publicKey?: string,
    privateKey?: string,
}

export interface Chat {
    id: string,
    name: string,
    isPending: boolean,
    isRequestedUser: boolean,
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
        socket.onAny((event: string, body: Message | Chats | ChatStatus) => {
            if (event.startsWith("newMessage") && "content" in body) {
                let event_splited = event.split("_");
                let chat_id = event_splited[event_splited.length - 1];
                console.log(event_splited);
                console.log(chat_id);
                if (params.id === chat_id) {
                    mutateChat((prev) => {
                        if (prev === undefined) {
                            return undefined;
                        }
                        return {
                            ...prev,
                            messages: [...prev.messages, body],
                        };
                    })
                }
                mutateChats(prev => {
                    if (prev === undefined) {
                        return undefined;
                    }
                    return prev.map(eachChat => {
                        if (eachChat.id === chat_id) {
                            return {
                                ...eachChat,
                                lastMessage: body,
                            };
                        }
                        return eachChat;
                    });
                });
            } else if (event === "newChat" && "name" in body) {
                if (body.publicKey !== undefined && body.privateKey !== undefined) {
                    let expires = Math.pow(2, 31) - 1;
                    Cookies.set(`publicKey.${body.id}`, body.publicKey, { expires: expires, sameSite: "Strict" });
                    Cookies.set(`privateKey.${body.id}`, body.privateKey, { expires: expires, sameSite: "Strict" });
                }
                mutateChats(prev => {
                    if (prev === undefined) {
                        return [body];
                    }
                    return [body, ...prev];
                })
            } else if (event === "chatStatus" && "confirmed" in body) {
                console.log("confirmed");
                console.log(body.confirmed);
                if (body.confirmed) {
                    if (body.publicKey !== undefined && body.privateKey !== undefined) {
                        let expires = Math.pow(2, 31) - 1;
                        Cookies.set(`publicKey.${body.chatId}`, body.publicKey, { expires: expires, sameSite: "Strict" });
                        Cookies.set(`privateKey.${body.chatId}`, body.privateKey, { expires: expires, sameSite: "Strict" });
                    }
                    mutateChats(prev => {
                        if (prev === undefined) {
                            return undefined;
                        }
                        return prev.map((chat) => {
                            if (chat.id === body.chatId) {
                                return {
                                    ...chat,
                                    isPending: false,
                                }
                            }
                            return chat
                        });
                    })
                    mutateChat(prev => {
                        if (prev === undefined) {
                            return prev;
                        }
                        if (prev.id === body.chatId) {
                            return {
                                ...prev,
                                isPending: false,
                            }
                        }
                        return prev;
                    })
                } else {
                    Cookies.remove(`publicKey.${body.chatId}`)
                    Cookies.remove(`privateKey.${body.chatId}`)
                    mutateChats(prev => {
                        if (prev === undefined) {
                            return undefined;
                        }
                        return prev.filter((chat) => {
                            if (chat.id === body.chatId) {
                                return false;
                            }
                            return true;
                        });
                    })
                    mutateChat(_ => {
                        setParams({ id: null }, { resolve: true })
                        return undefined;
                    })
                }
            }
        })
        //socket.on("newMessage", (message: Message) => {
        //    mutateChat((prev) => {
        //        if (prev === undefined) {
        //            return undefined;
        //        }
        //        return {
        //            ...prev,
        //            messages: [...prev.messages, message],
        //        };
        //    })
        //    mutateChats(prev => {
        //        if (prev === undefined) {
        //            return undefined;
        //        }
        //        return prev.map(eachChat => {
        //            if (eachChat.id === chat()?.id) {
        //                return {
        //                    ...eachChat,
        //                    lastMessage: message,
        //                };
        //            }
        //            return eachChat;
        //        });
        //    });
        //});
        //
        //socket.on("newChat", (chat: Chats) => {
        //    mutateChats(prev => {
        //        if (prev === undefined) {
        //            return [chat];
        //        }
        //        return [chat, ...prev];
        //    })
        //});

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
                socket={socket}
            />
        </div>
    );
};
export default Conversation;
