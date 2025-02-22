/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'

const root = document.getElementById('root')

let Conversation = lazy(() => import("./conversation/index.tsx"));
let SignInComponent = lazy(() => import("./sign_in/index.tsx"));
let SignUpComponent = lazy(() => import("./sign_up/index.tsx"));

render(
    () => (
        <div>
            <Router>
                <Route path="/" component={Conversation} />
                <Route path="/sign-in" component={SignInComponent} />
                <Route path="/sign-up" component={SignUpComponent} />
            </Router>
        </div>
    ),
    root!
)
