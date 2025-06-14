import * as React from 'react';
import { Layout, Menu, Typography, Space, Button } from 'antd';
import { ContainerOutlined, HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import { NavigationProps } from '../types/navigation';

const { Header } = Layout;
const { Title } = Typography;

interface NavBarProps extends NavigationProps {
    title?: string;
    logo?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
                                           activeKey,
                                           onNavigate,
                                           onLogout,
                                           title = 'Docker Manager',
                                           logo = <ContainerOutlined className="text-2xl" />,
                                           style,
                                           className = ''
                                       }) => {
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const role = localStorage.getItem('role'); // Get the role from localStorage

    // Define menu items based on role
    const items = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeOutlined />,
            path: '/home'
        },
        {
            key: 'containers',
            label: 'Containers',
            icon: <ContainerOutlined />,
            path: '/containerlist'
        },
        ...(role === 'admin'
            ? [{
                key: 'dashboard',
                label: 'Dashboard',
                icon: <DashboardOutlined />,
                path: '/DashBoar-admin'
            }]
            : [])
    ];

    const handleMenuClick = (e: { key: string }) => {
        const item = items.find(i => i.key === e.key);
        if (item && onNavigate) {
            onNavigate(item.key, item.path);
        }
    };

    const handleLogoutClick = async () => {
        if (onLogout) {
            try {
                setIsLoggingOut(true);
                await Promise.resolve(onLogout());
            } finally {
                setIsLoggingOut(false);
            }
        }
    };

    return (
        <Header style={{ background: 'white', ...style }} className={className}>
            <div className="container mx-auto flex justify-between items-center">
                <Space>
                    {logo}
                    <Title level={4} style={{ margin: 0 }}>{title}</Title>
                </Space>
                <div className="flex items-center gap-4">
                    <Menu
                        mode="horizontal"
                        selectedKeys={activeKey ? [activeKey] : []}
                        items={items.map(item => ({
                            key: item.key,
                            label: item.label,
                            icon: item.icon
                        }))}
                        onClick={handleMenuClick}
                        overflowedIndicator={null}
                        disabledOverflow={true}
                        style={{
                            lineHeight: '60px',
                            borderBottom: 'none',
                            whiteSpace: 'nowrap'
                        }}
                    />
                    {onLogout && (
                        <Button
                            type="primary"
                            danger
                            onClick={handleLogoutClick}
                            loading={isLoggingOut}
                            className="ml-4"
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </Header>
    );
};

export default NavBar;
