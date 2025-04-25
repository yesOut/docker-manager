import * as React from 'react';
import { Layout, App as AntdApp } from 'antd'; // Import Antd's App component
import NavBar from './components/NavBar';
import ContainerList from './components/ContainerList';
import { ConfigProvider, ThemeConfig } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';

const { Content } = Layout;

const App: React.FC = () => {
  const theme: ThemeConfig = {
    token: {
      colorPrimary: '#1677ff',
    },
  };

  const navItems = [
    { key: 'containers', label: 'Containers', path: '/', icon: <ContainerOutlined /> },
    { key: 'images', label: 'Images', path: '/images' },
    { key: 'networks', label: 'Networks', path: '/networks' },
  ];

  const handleNavigate = (key: string, path: string) => {
    // Implement your navigation logic here
    console.log(`Navigating to ${path}`);
    // You can use react-router's useNavigate here if you're using it
  };

  return (
    <ConfigProvider theme={theme}>
      <AntdApp> {/* Wrap your app with Antd's App component */}
        <Layout className="layout">
          <NavBar 
            items={navItems} 
            onNavigate={handleNavigate}
            activeKey="containers"
          />
          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
            <ContainerList />
          </Content>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;