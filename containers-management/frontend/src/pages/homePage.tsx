import React, {JSX} from 'react';
import { App as AntdApp, ConfigProvider, Layout, message, ThemeConfig } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../components/ScrollToTopButton";
import { Footer } from "../components/Footer";
import HomeHeader from "../components/HomeHeader";

const { Content } = Layout;

const navItems = [
    { key: 'DashBoard Admin', label: 'DashBoard Admin', path: '/DashBoar-admin' },
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

    const handleLogout = () => {
        try {
            clearAuthData();
            messageApi.success('Logged out successfully');
            setTimeout(() => navigate('/signin'), 1000);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        } catch (error) {
            messageApi.error('Logout failed. Please try again.');
            console.error('Logout error:', error);
        }
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
                {contextHolder}
                <Layout className="layout">
                    <NavBar
                        items={navItems}
                        activeKey={activeKey}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                    <Content >
                        <HomeHeader />
                    </Content>
                    <ScrollToTop />
                    <Footer />
                </Layout>
            </AntdApp>
        </ConfigProvider>
    );
}