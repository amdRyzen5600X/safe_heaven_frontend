import { createSignal, For, Resource, Show } from "solid-js";
import ChatComponent, { Chats } from "../components/chat";
import { NewChatPopup } from "../components/newChatPopup";
import { Socket } from "socket.io-client";


const ChatNavBar = (props: {
    chats: Resource<Chats[]>;
    select_chat: (id: string | undefined) => void;
    socket: { socket?: Socket }
}) => {
    const [showPopup, setShowPopup] = createSignal(false);
    const [username, setUsername] = createSignal("");

    function newChatPopup(_: MouseEvent) {
        setShowPopup(true);
    }

    function handleSubmit(e: Event) {
        e.preventDefault();
        console.log(`created chat with user ${username()}`)
        try {
            props.socket.socket?.emit("createChat", { username: username() })
        } catch {
            console.log(`unnable to create chat with user ${username()}`)
        }
        setShowPopup(false);
        setUsername("");
    }

    return (
        <div class="w-1/4 bg-gray-800 p-4 flex-grow flex h-full overflow-auto flex-col">
            <div class="text-2xl font-bold mb-4 flow-root">
                <h1 class="float-left">Chats</h1>
                <button
                    class="hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 px-3 py-1.5 float-right rounded-md bg-indigo-600"
                    onClick={newChatPopup}
                >+</button>
            </div>
            <div class="space-y-2 w-full overflow-auto">
                <For each={props.chats()}>
                    {(chat) => (
                        <ChatComponent chat={chat} select_chat={props.select_chat} />
                    )}
                </For>
            </div>

            <Show when={showPopup()}>
                <NewChatPopup handleSubmit={handleSubmit} username={username} setUsername={setUsername} setShowPopup={setShowPopup} />
            </Show>

        </div>
    );
};

export default ChatNavBar;
