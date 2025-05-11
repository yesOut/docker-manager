import React, {JSX} from "react";
import {Layout, App as AntdApp, theme, message} from 'antd';
import ScrollToTop from '../components/ScrollToTopButton';
import Dashboard from "../components/Dashboard ";
import NavBar from "../components/NavBar";
import {Footer} from "../components/Footer";
import {useNavigate, useLocation} from 'react-router-dom';
import {ConfigProvider, ThemeConfig} from 'antd';
import Containers from "../components/ContainerList";


const {Content} = Layout;

const navItems = [
    { key: 'home', label: 'Home', path: '/home' },
    { key: 'containers', label: 'Containers', path: '/containerlist' }
];

const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('sessionToken');
};

export default function HomePage(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNavigate = (key: string, path: string) => {
        navigate(path);
    };

    const activeKey = location.pathname === '/' ? 'home' : location.pathname.split('/')[1];

    const handleLogout = () => {
        try {
            clearAuthData();
            messageApi.success('Logged out successfully');
            setTimeout(() => navigate('/signin'), 1000);
        } catch (error) {
            messageApi.error('Logout failed. Please try again.');
            console.error('Logout error:', error);
        }
    };

    const theme: ThemeConfig = {
        token: {
            colorPrimary: '#1677ff',
        },
    };

    return (
        <ConfigProvider theme={theme}>
            <AntdApp>
                {contextHolder}
                <Layout className="layout">
                    <NavBar
                        items={navItems}
                        activeKey={activeKey}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                    <Content className="container mx-auto p-4">
                        <Dashboard/>
                    </Content>
                    <ScrollToTop/>
                    <Footer/>
                </Layout>
            </AntdApp>
        </ConfigProvider>
    );
}