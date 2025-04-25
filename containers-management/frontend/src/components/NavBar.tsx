// src/components/NavBar.tsx
import * as React from 'react';
import { Layout, Menu, Typography, Space } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import { NavigationProps } from '../types/navigation';

// Correct way to import Layout components
const Header = Layout;
const { Title } = Typography;

interface NavBarProps extends NavigationProps {
  title?: string;
  logo?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ 
  items, 
  activeKey, 
  onNavigate, 
  title = 'Docker Management', 
  logo = <ContainerOutlined className="text-2xl" />,
  style,
  className = ''
}) => {
  const headerStyle: React.CSSProperties = {
    background: 'white',
    ...style,
  };

  const handleMenuClick = (e: { key: string }) => {
    const item = items.find(i => i.key === e.key);
    if (item && onNavigate) {
      onNavigate(item.key, item.path);
    }
  };

  return (
    <Header style={headerStyle} className={className}>
      <div className="container mx-auto flex justify-between items-center">
        <Space>
          {logo}
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </Space>
        <Menu
          mode="horizontal"
          selectedKeys={activeKey ? [activeKey] : []}
          items={items.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon
          }))}
          onClick={handleMenuClick}
        />
      </div>
    </Header>
  );
};

export default NavBar;