import { Button } from "../components/button"
import { Input } from "../components/input"

function SignUpComponent() {
    return (
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <form class="space-y-6" action="#" method="post">
                <Input
                    text="Email Adress"
                    type="email"
                    autocomplete="email"
                    name="email"
                    id="email"
                />
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
