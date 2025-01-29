/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { Route, Router } from '@solidjs/router'
import { SignInComponent } from './sign_in/index.tsx'
import { SignUpComponent } from './sign_up/index.tsx'
import MessengerChooseChat from './messanger_choose_chat/index.tsx'
import Conversation from './conversation/index.tsx'

const root = document.getElementById('root')

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
