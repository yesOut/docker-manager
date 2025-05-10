import React, {JSX} from "react";
import {Layout, App as AntdApp, theme} from 'antd';
import ScrollToTop from '../components/ScrollToTopButton';
import Dashboard from "../components/Dashboard ";
import NavBar from "../components/NavBar";
import {Footer} from "../components/Footer";
import {useNavigate, useLocation} from 'react-router-dom';
import {ConfigProvider, ThemeConfig} from 'antd';


const {Content} = Layout;

const navItems = [
    {key: 'home', label: 'Home', path: '/home'},
    {key: 'containers', label: 'Containers', path: '/containerlist'},
    {key: 'signin', label: 'Sign In', path: '/signin'},
    {key: 'signup', label: 'Sign Up', path: '/signup'},
];

export default function HomePage(): JSX.Element {
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
                    <Dashboard/>
                    <ScrollToTop/>
                    <Footer/>
                </Layout>
            </AntdApp>
        </ConfigProvider>
    );
}