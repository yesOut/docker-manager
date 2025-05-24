import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import logo from '../assets/images/logo_docker.png';

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

interface DeviceStats {
    usagePercentCpu: number;
    ram: {
        usagePercent: number;
    };
}

export default function Example() {
    const [cpuUsage, setCpuUsage] = useState<string>('---');
    const [memoryUsage, setMemoryUsage] = useState<string>('---');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchDeviceStats = async () => {
        try {
            const response = await axios.get('/api/device', {
                headers: getAuthHeaders(),
            });
            const data: DeviceStats = response.data?.data;
            if (data) {
                setCpuUsage(`${data.usagePercentCpu.toFixed(2)}%`);
                setMemoryUsage(`${data.ram.usagePercent.toFixed(2)}%`);
            }
        } catch (error) {
            console.error('Failed to fetch device stats', error);
        }
    };

    useEffect(() => {
        fetchDeviceStats();
        const interval = setInterval(fetchDeviceStats, 700);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white">
            <div className="relative isolate px-4 lg:px-8">
                <div className="flex items-center justify-center">
                    <img src={logo} alt="Docker Logo" className="h-64 w-auto" />
                </div>
                <div className="mx-auto max-w-2xl">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                            Data to enrich your online business
                        </h1>

                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            Elit sunt amet fugiat veniam occaecat.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/signin"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </Link>
                            <Link to="#" className="text-sm/6 font-semibold text-gray-900">
                                Learn more <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">User Resources:</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                        <StatsCard title="CPU" value={cpuUsage} icon="🏾️" color="bg-blue-400" />
                        <StatsCard title="Memory" value={memoryUsage} icon="💾" color="bg-blue-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
