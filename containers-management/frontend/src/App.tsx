import * as React from 'react';
import ScrollToTop from './components/ScrollToTopButton';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Layout, App as AntdApp } from 'antd';
import NavBar from './components/NavBar';
import ContainerList from './pages/containersPage';
import { ConfigProvider, ThemeConfig } from 'antd';
import SignInPage from './pages/signInPage';
import SignUpPage from './pages/signUpPage';
import HomePage from './pages/homePage';
import NotFound from './components/NotFound';
import { Footer } from "./components/Footer";
import './assets/output.css';

const { Content } = Layout;

const App: React.FC = () => {
    const theme: ThemeConfig = {
        token: {
            colorPrimary: '#1677ff',
        },
    };

    const navItems = [
        { key: 'home', label: 'Home', path: '/home' },
        { key: 'containers', label: 'Containers', path: '/containerlist' },
        { key: 'signin', label: 'Sign In', path: '/signin' },
        { key: 'signup', label: 'Sign Up', path: '/signup' },
    ];

    const NavHandler = () => {
        const navigate = useNavigate();
        const location = useLocation();

        const handleNavigate = (key: string, path: string) => {
            navigate(path);
        };

        return (
            <Layout className="layout">
                <NavBar
                    items={navItems}
                    activeKey={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]}
                    onNavigate={handleNavigate}
                />
                <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/containerlist" element={<ContainerList />} />                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
                <ScrollToTop />
                <Footer />
            </Layout>
        );
    };

    return (
        <ConfigProvider theme={theme}>
            <AntdApp>
                <Router>
                    <NavHandler />
                </Router>
            </AntdApp>
        </ConfigProvider>
    );
};

export default App;