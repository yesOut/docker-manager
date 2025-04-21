import { Layout, Typography, Space } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import React from 'react';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  style?: React.CSSProperties;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ style, className = '' }) => {
  const headerStyle: React.CSSProperties = {
    background: 'white',
    ...style,
  };

  return (
    <Header style={headerStyle} className={className}>
      <div className="container mx-auto flex justify-between items-center">
        <Space>
          <ContainerOutlined className="text-2xl" />
          <Title level={4} style={{ margin: 0 }}>Docker Management</Title>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;