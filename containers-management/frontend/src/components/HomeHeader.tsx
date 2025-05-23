import React, {useState} from 'react'
import {Link} from 'react-router-dom';

import {Dialog, DialogPanel} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
// @ts-ignore
import logo from '../assets/images/logo_docker.png';
import ContainersTable from "./ContainersTable";
import UserTable from "./UserTable";

const navigation = [
    {name: 'Product', href: '#'},
    {name: 'Features', href: '#'},
    {name: 'Marketplace', href: '#'},
    {name: 'Company', href: '#'},
]

interface StatsCardProps {
    title: string;
    value: string;
    icon: string;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({title, value, icon, color}) => (
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

export default function Example() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigation: NavigationItem[] = [
        {name: 'CPU', icon: '🏾', current: false},
        {name: 'Memory', icon: '💾', current: false},
    ];

    return (
        <div className="bg-white">
            <div className="relative isolate px-4 lg:px-8">
                <div className="flex items-center justify-center">
                    <img src={logo} alt="Docker Logo" className="h-64 w-auto"/>
                </div>
                <div className="mx-auto max-w-2xl ">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div
                            className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Announcing our next round of funding.{' '}
                            <a href="#" className="font-semibold text-indigo-600">
                                <span aria-hidden="true" className="absolute inset-0"/>
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                            Data to enrich your online business
                        </h1>

                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            Elit sunt amet
                            fugiat veniam occaecat.
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
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                    />
                </div>
                <hr className="my-4 border-gray-200"/>
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800"> User Resources:</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                        <StatsCard title="CPU" value="---" icon="🏾️" color="bg-blue-400" />
                        <StatsCard title="Memory" value="---" icon="💾" color="bg-blue-400" />
                    </div>
                </div>
                </div>

        </div>
    )
}
