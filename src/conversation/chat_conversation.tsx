import { Show, For, Accessor, Setter } from "solid-js";

const ChatConversationComponent = (props: { selectedChat: Accessor<string | null>, selectedChatMessages: Accessor<string[]>, message: Accessor<string>, setMessage: Setter<string>, handleSendMessage: () => void }) => {
    return (
        <div class="flex-1 bg-gray-900 p-4">
            <Show when={!!props.selectedChat()} fallback={
                <div>
                    <h1 class="text-2xl font-bold mb-4">Welcome to Messenger</h1>
                    <p class="text-gray-400">Select a chat to start messaging.</p>
                </div>
            }>
                <div>
                    <h1 class="text-2xl font-bold mb-4">Chat {props.selectedChat()}</h1>
                    <div class="space-y-2">
                        <For each={props.selectedChatMessages()}>
                            {(message) => (
                                <div class="p-4 bg-gray-800 rounded-lg shadow-md">
                                    <p class="text-gray-300">{message}</p>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
                <div class="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 mt-auto">
                    <form class="flex items-center space-x-2"
                        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); props.handleSendMessage(); }}
                    >
                        <input
                            type="text"
                            value={props.message()}
                            onInput={(e) => props.setMessage(e.currentTarget.value)}
                            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); props.handleSendMessage(); }}
                            class="flex-1 p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={props.handleSendMessage}
                            type="button"
                            class="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </Show>
        </div>
    );
};
export default ChatConversationComponent;
