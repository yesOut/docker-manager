import React, {JSX} from "react";
import ScrollToTop from '../components/ScrollToTopButton';
import Dashboard from "../components/Dashboard ";


export default function SignInPage(): JSX.Element {
    return (
        <>
            <Dashboard />
            <ScrollToTop />
        </>

    );
}