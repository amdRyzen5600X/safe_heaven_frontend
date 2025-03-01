import { useSearchParams } from "@solidjs/router";
import { Socket } from "socket.io-client";
import { Show } from "solid-js";

const PendingChat = (props: {
    isRequestedUser: boolean | undefined,
    username: string | undefined
    socket: { socket?: Socket }
}) => {
    let [params, _] = useSearchParams();
    const hanleConfirm = () => {
        props.socket.socket?.emit("confirm", {chatId: params.id})
    };
    const handleDecline = () => {
        props.socket.socket?.emit("decline", {chatId: params.id})
    };
    console.log(props);
    return (
        <div class="flex flex-col items-center justify-center space-y-4">
            <Show when={props.isRequestedUser} fallback={
                <p class="text-gray-300">{`Waiting to answer from ${props.username}`}</p>
            }>
                <p class="text-gray-300">{`${props.username} wants to start a chat with you`}</p>
                <div class="flex space-x-4">
                    <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={hanleConfirm}>{"Confirm"}</button>
                    <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDecline}>{"Decline"}</button>
                </div>
            </Show>
        </div>
    );
}

export { PendingChat }
