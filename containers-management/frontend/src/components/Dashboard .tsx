import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: string; // Using string for text-based icons
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

const DashboardAdmin: React.FC = () => {
    const navigation: NavigationItem[] = [
        { name: 'Dashboard', icon: '📊', current: true },
        { name: 'Users', icon: '👤', current: false },
        { name: 'Docker Containers', icon: '🐳', current: false },
        { name: 'CPU', icon: '🏾', current: false },
        { name: 'Memory', icon: '💾', current: false },
    ];

    const recentActivity = [
        { id: 1, user: 'Eya Oueslati', images: '5', time: '5 min ago' },
        { id: 2, user: 'Rahma Khlifi', images: '3', time: '2 hours ago' },
    ];

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
                                className={`flex items-center p-3 rounded-lg mb-2 ${
                                    item.current ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
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
                        <StatsCard
                            title="Total Users"
                            value="2"
                            icon="👥"
                            color="bg-blue-500"
                        />
                        <StatsCard
                            title="Docker Containers"
                            value="4"
                            icon="🐳"
                            color="bg-green-500"
                        />
                        <StatsCard
                            title="CPU"
                            value="---"
                            icon="🏾️"
                            color="bg-purple-500"
                        />
                        <StatsCard
                            title="Memory"
                            value="---"
                            icon="💾"
                            color="bg-orange-500"
                        />
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                        <div className="h-64 bg-gray-100 rounded-lg">
                            {/* Chart placeholder */}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="text-left text-gray-600 border-b">
                                    <th className="pb-3">User</th>
                                    <th className="pb-3">Images</th>
                                    <th className="pb-3">Time</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentActivity.map((activity) => (
                                    <tr key={activity.id} className="border-b last:border-b-0">
                                        <td className="py-3">{activity.user}</td>
                                        <td className="py-3">{activity.images}</td>
                                        <td className="py-3 text-gray-500">{activity.time}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;