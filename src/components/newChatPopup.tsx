import { Accessor, Setter } from "solid-js"

const NewChatPopup = (props: { handleSubmit: (e: Event) => void, username: Accessor<string>, setUsername: Setter<string>, setShowPopup: Setter<boolean> }) => {
    return (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div class="bg-gray-800 p-6 rounded-lg">
                <form onSubmit={props.handleSubmit}>
                    <label for="username" class="block text-sm font-medium text-gray-300">{"Username"}</label>
                    <input
                        type="text"
                        id="username"
                        value={props.username()}
                        onInput={(e) => props.setUsername(e.currentTarget.value)}
                        class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        required
                    />
                    <div class="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => props.setShowPopup(false)}
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
    )
}

export { NewChatPopup };
