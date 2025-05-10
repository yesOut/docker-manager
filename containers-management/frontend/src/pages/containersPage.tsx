import React, {JSX} from "react";
import Containers from '../components/ContainerList';
import {App as AntdApp, ConfigProvider, Layout, ThemeConfig} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import Dashboard from "../components/Dashboard ";
import ScrollToTop from "../components/ScrollToTopButton";
import {Footer} from "../components/Footer";


const {Content} = Layout;

const navItems = [
    {key: 'home', label: 'Home', path: '/home'},
    {key: 'containers', label: 'Containers', path: '/containerlist'},
    {key: 'signin', label: 'Sign In', path: '/signin'},
    {key: 'signup', label: 'Sign Up', path: '/signup'},
];

export default function containersPage(): JSX.Element {

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (key: string, path: string) => {
        navigate(path);
    };

    const activeKey = location.pathname === '/' ? 'home' : location.pathname.split('/')[1];

    const theme: ThemeConfig = {
        token: {
            colorPrimary: '#1677ff',
        },
    };
    return (
        <ConfigProvider theme={theme}>
            <AntdApp>
                <Layout className="layout">
                    <NavBar
                        items={navItems}
                        activeKey={activeKey}
                        onNavigate={handleNavigate}
                    />
                    <Containers/>
                    <ScrollToTop/>
                    <Footer/>
                </Layout>
            </AntdApp>
        </ConfigProvider>
    );
}