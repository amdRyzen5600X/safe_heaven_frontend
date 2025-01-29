import { Accessor, For } from "solid-js";
import { Chat } from ".";



const ChatNavBar = (props: {chats: Accessor<Chat[]>; select_chat: (id: string | undefined) => void} ) => {
    return (
        <div class="w-1/4 bg-gray-800 p-4">
            <h1 class="text-2xl font-bold mb-4">Chats</h1>
            <div class="space-y-2">
                <For each={props.chats()}>
                    {(chat) => (
                        <div
                            class="p-4 bg-gray-700 rounded-lg shadow-md cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                            onClick={() => props.select_chat(chat.id)}
                        >
                            <h2 class="text-lg font-semibold">{chat.name}</h2>
                            <p class="text-sm text-gray-300">{chat.lastMessage}</p>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};

export default ChatNavBar;
