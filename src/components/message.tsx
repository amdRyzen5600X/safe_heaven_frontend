import { Message } from "./chat";

const MessageComponent = (props: { message: Message }) => {
    return (
        <div class="p-4 bg-gray-800 rounded-lg shadow-md">
            <p class="text-gray-300">{props.message.senderUsername}</p>
            <p class="text-gray-300">{props.message.content}</p>
        </div>
    );
};

export default MessageComponent;
