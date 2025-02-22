import { A, action, redirect } from "@solidjs/router";
import { Button } from "../components/button"
import { Input } from "../components/input"
import { JwtResp } from "../sign_in";
import { createSignal, Show } from "solid-js";
import createAxiosInstance, { env } from "../api";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";



function SignUpComponent() {
    const [successSignUp, setSuccessSignUp] = createSignal(true);
    const submitForm = action(async (formData: FormData) => {
        const username = formData.get("username")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const confirmPassword = formData.get("confirm password")?.toString() ?? "";

        try {
            let client = createAxiosInstance(env.BASE_URL);
            let response: AxiosResponse<JwtResp> = await client.post("/auth/sign-in", { login: username, password, confirmPassword });
            if (response.status === 200) {
                let jwtResp: JwtResp = response.data;
                Cookies.set("access_token", jwtResp.access_token, { expires: 1, sameSite: "Strict" });
                Cookies.set("refresh_token", jwtResp.refresh_token, { expires: 7, sameSite: "Strict" });
                return redirect("/");
            }
            setSuccessSignUp(false);
        } catch {
            throw redirect("/sign-up");
        }
    })
    return (
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <Show when={!successSignUp()} >
                <div class="bg-red-500 p-4 rounded-lg shadow-md">
                    <span class="text-white font-bold">
                        {"Warning: Sign up failed!"}
                    </span>
                </div>
            </Show>
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
                <div class="space-y-6">
                    <Button text="Sign up" type="submit" />
                    <div class="text-white">
                        <span>{"Already have an account? "}</span><A href="/sign-in" class="underline text-blue-600">{"sign in"}</A>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignUpComponent;
