import { Accessor, For } from "solid-js";
import ChatComponent, { Chat } from "../components/chat";



const ChatNavBar = (props: { chats: Accessor<Chat[]>; select_chat: (id: string | undefined) => void }) => {
    return (
        <div class="w-1/4 bg-gray-800 p-4 flex-grow flex h-full overflow-auto flex-col">
            <h1 class="text-2xl font-bold mb-4">Chats</h1>
            <div class="space-y-2 w-full overflow-auto">
                <For each={props.chats()}>
                    {(chat) => (
                        <ChatComponent chat={chat} select_chat={props.select_chat} />
                    )}
                </For>
            </div>
        </div>
    );
};

export default ChatNavBar;
