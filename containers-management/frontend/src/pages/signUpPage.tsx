import React, {JSX} from "react";
import { App } from 'antd';
import Signup from "../components/Signup";

export default function SignUpPage(): JSX.Element {
    return (
        <App>
            <Signup/>
        </App>
    );
}