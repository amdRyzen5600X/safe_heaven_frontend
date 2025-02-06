function Input(props: { text: string, type: string, name: string, id: string, autocomplete: string }) {
    return (
        <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-200">{props.text}</label>
            <div class="mt-2">
                <input
                    type={props.type}
                    name={props.name}
                    id={props.id}
                    autocomplete={props.autocomplete}
                    required class="block w-full rounded-md bg-gray px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
            </div>
        </div>
    );
}
export { Input }
