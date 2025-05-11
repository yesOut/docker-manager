import React, {JSX} from "react";
import { App } from 'antd';
import Signin from '../components/Login';

export default function SignInPage(): JSX.Element {
    return (
        <App>
            <Signin/>
        </App>
    );
}