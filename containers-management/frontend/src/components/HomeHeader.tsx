import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
                        <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">
                            Conception et réalisation d’une plateforme de monitoring des images dockers.
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            Une plateforme de monitoring des images Docker représente un levier stratégique pour améliorer la supervision, l’administration,
                            et la fiabilité des environnements conteneurisés. Ce projet vise à concevoir et réaliser une solution web qui permet aux utilisateurs
                            notamment les administrateurs système et DevOps de visualiser, contrôler et interagir efficacement avec les images Docker déployées sur
                            leurs machines.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/containerlist"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
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
                <hr className="my-4 border-gray-200" />
                <div className="flex items-center justify-center gap-x-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">About:</h1>
                    </div>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
                        La solution proposée permet notamment : <br/>
                        •	La gestion des utilisateurs et l’authentification sécurisée,<br/>
                        •	La gestion complète des images Docker (ajout, suppression, arrêt, redémarrage, logs, etc.),<br/>
                        •	L’intégration d’un tableau de bord interactif affichant des statistiques en temps réel sur l’utilisation des ressources machines (CPU, mémoire, réseau),<br/>
                        •	Ainsi qu’une interface ergonomique pour simplifier l’expérience d’utilisation.

                    </p>
                </div>
            </div>
        </div>
    );
}
