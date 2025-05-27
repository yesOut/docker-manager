import * as React from 'react';
import ScrollToTop from './components/ScrollToTopButton';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, App as AntdApp } from 'antd';
import ContainerList from './pages/containersPage';
import { ConfigProvider, ThemeConfig } from 'antd';
import SignInPage from './pages/signInPage';
import SignUpPage from './pages/signUpPage';
import DashBoarAdminPage from './pages/dashBoarAdminPage';
import HomePage from './pages/homePage';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './assets/output.css';

const { Content } = Layout;

const App: React.FC = () => {
    const theme: ThemeConfig = {
        token: {
            colorPrimary: '#1677ff',
        },
    };

    return (
        <ConfigProvider theme={theme}>
            <AntdApp>
                <Router>
                    <Layout className="layout">
                        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/signin" replace />} />
                                <Route path="/signin" element={<SignInPage />} />
                                <Route element={<ProtectedRoute />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/DashBoar-admin" element={<DashBoarAdminPage />} />
                                <Route path="/containerlist" element={<ContainerList />} />
                                <Route path="/signup" element={<SignUpPage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Content>
                        <ScrollToTop />
                    </Layout>
                </Router>
            </AntdApp>
        </ConfigProvider>
    );
};

export default App;