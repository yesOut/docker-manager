import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContainersTable from './ContainersTable';
import UserTable from './UserTable';

interface StatsCardProps {
    title: string;
    value: string;
    icon: string;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-lg shadow-sm ${color} text-white`}>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
            <div className="text-3xl">{icon}</div>
        </div>
    </div>
);

interface NavigationItem {
    name: string;
    icon: string;
    current: boolean;
}

interface Container {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const DashboardAdmin: React.FC = () => {
    const navigation: NavigationItem[] = [
        { name: 'Dashboard', icon: '📊', current: true },
        { name: 'Users', icon: '👤', current: false },
        { name: 'Docker Containers', icon: '🐳', current: false },
        { name: 'CPU', icon: '🏾', current: false },
        { name: 'Memory', icon: '💾', current: false },
    ];

    const [containers, setContainers] = useState<Container[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [cpuUsage, setCpuUsage] = useState<string>('---');
    const [memoryUsage, setMemoryUsage] = useState<string>('---');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return {};
        }
        return { Authorization: `Bearer ${token}` };
    };

    const fetchContainers = async () => {
        try {
            const response = await axios.get('/containers', {
                headers: getAuthHeaders(),
            });
            setContainers(response.data);
        } catch (error) {
            console.error('Failed to fetch containers', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error('Unauthorized: Check your token');
            }
        }
    };

    // Separated fetchUsers function - only called when needed
    const fetchUsers = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) {
                console.error('Cannot fetch users: No authorization token');
                return;
            }

            const response = await axios.get('/api/users', {
                headers,
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.error('Unauthorized: Token may be expired or invalid');
                } else if (error.response?.status === 403) {
                    console.error('Forbidden: Insufficient permissions');
                }
            }
        }
    };

    const fetchDeviceStats = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) {
                console.error('Cannot fetch device stats: No authorization token');
                return;
            }

            const response = await axios.get('/api/device', {
                headers,
            });
            const data = response.data?.data;
            if (data) {
                setCpuUsage(`${data.usagePercentCpu.toFixed(2)}%`);
                setMemoryUsage(`${data.ram.usagePercent.toFixed(2)}%`);
            }
        } catch (error) {
            console.error('Failed to fetch device stats', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error('Unauthorized: Check your token for device stats');
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please login.');
            return;
        }
        fetchContainers();
        fetchDeviceStats();
        fetchUsers();
        const interval = setInterval(fetchDeviceStats, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <div className="w-64 bg-white shadow-lg min-h-screen p-4">
                    <div className="text-xl font-bold text-gray-800 mb-8">Admin Panel</div>
                    <nav>
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href="#"
                                className={`flex items-center p-3 rounded-lg mb-2 ${item.current ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <span className="mr-3 text-xl">{item.icon}</span>
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard title="Docker Containers" value={String(containers.length)} icon="🐳" color="bg-green-500" />
                        <StatsCard title="Total Users" value={String(users.length)} icon="👥" color="bg-blue-500" />
                        <StatsCard title="CPU" value={cpuUsage} icon="🏾️" color="bg-purple-500" />
                        <StatsCard title="Memory" value={memoryUsage} icon="💾" color="bg-orange-500" />
                    </div>

                    <ContainersTable containers={containers} setContainers={setContainers} />

                    <div className="bg-white p-6 rounded-lg shadow-sm m-4">
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        <UserTable users={users} setUsers={setUsers} fetchUsers={fetchUsers} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;