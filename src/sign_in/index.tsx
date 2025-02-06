import { action, redirect } from "@solidjs/router"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { getTomorowDate } from "../utils"

type JwtResp = {
    access_token: string,
}

const submitForm = action(async (formData: FormData) => {
    const username = formData.get("username")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    //let response = await fetch("http://127.0.0.1:3000/auth/sign-in", { method: "POST", body: JSON.stringify({ username, password }) });
    try {
        let resp: JwtResp = await (await fetch(
            "http://127.0.0.1:3000/auth/sign-in",
            {
                method: "POST",
                body: JSON.stringify({ login: username, password }),
                headers: { "Content-Type": "application/json; charset=utf-8" },
            },
        )).json();
        document.cookie = `access_token=${resp.access_token}; expires=${getTomorowDate().toUTCString()}; path=/; SameSite=None; Secure`
        return redirect("/");
    } catch {
        throw redirect("/sign-in");
    }
})

function SignInComponent() {
    return (
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <form class="space-y-6" action={submitForm} method="post">
                <Input
                    text="username"
                    type="username"
                    autocomplete="username"
                    name="username"
                    id="username"
                />
                <Input
                    text="Password"
                    type="password"
                    name="password"
                    id="password"
                    autocomplete="current-password"
                />
                <div>
                    <Button text="Sign in" type="submit" />
                </div>
            </form>
        </div>
    )
}

export { SignInComponent }
