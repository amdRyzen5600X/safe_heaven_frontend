const MessageComponent = (props: { message: string }) => {
    return (
        <div class="p-4 bg-gray-800 rounded-lg shadow-md">
            <p class="text-gray-300">{props.message}</p>
        </div>
    );
};

export default MessageComponent;
