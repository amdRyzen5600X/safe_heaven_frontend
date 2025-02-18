import { createSignal, For, Resource } from "solid-js";
import ChatComponent, { Chats } from "../components/chat";
import { Socket } from "socket.io-client";


const ChatNavBar = (props: {
    chats: Resource<Chats[]>;
    select_chat: (id: string | undefined) => void;
    socket: {socket? :Socket}
}) => {
    const [showPopup, setShowPopup] = createSignal(false);
    const [userId, setUserId] = createSignal("");

    function newChatPopup(_: MouseEvent) {
        setShowPopup(true);
    }

    function handleSubmit(e: Event) {
        e.preventDefault();
        console.log(`created chat with user ${userId()}`)
        try{
            props.socket.socket?.emit("createChat", {userId: userId()})
        } catch {
            console.log(`unnable to create chat with user ${userId()}`)
        }
        setShowPopup(false);
        setUserId("");
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

            {showPopup() && (
                <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div class="bg-gray-800 p-6 rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <label for="userId" class="block text-sm font-medium text-gray-300">User ID</label>
                            <input
                                type="text"
                                id="userId"
                                value={userId()}
                                onInput={(e) => setUserId(e.currentTarget.value)}
                                class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                required
                            />
                            <div class="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(false)}
                                    class="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatNavBar;
