import { action, redirect } from "@solidjs/router";
import { Button } from "../components/button"
import { Input } from "../components/input"
import { JwtResp } from "../sign_in";
import { getTomorowDate } from "../utils";

const submitForm = action(async (formData: FormData) => {
    const username = formData.get("username")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirm password")?.toString() ?? "";

    try {
        let resp: JwtResp = await (await fetch(
            `https://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/sign-up`,
            {
                method: "POST",
                body: JSON.stringify({ login: username, password, confirmPassword}),
                headers: { "Content-Type": "application/json; charset=utf-8" },
            },
        )).json();
        document.cookie = `access_token=${resp.access_token}; expires=${getTomorowDate().toUTCString()}; path=/; SameSite=None; Secure`
        return redirect("/");
    } catch {
        throw redirect("/sign-up");
    }
})


function SignUpComponent() {
    return (
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <form class="space-y-6" action={submitForm} method="post">
                <Input
                    text="username"
                    type="text"
                    autocomplete="on"
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
                <Input
                    text="Confirm password"
                    type="password"
                    name="confirm password"
                    id="confirm password"
                    autocomplete="current-password"
                />
                <div>
                    <Button text="Sign up" type="submit" />
                </div>
            </form>
        </div>
    )
}

export { SignUpComponent }
