import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    const navItems = [
        { name: 'Dashboard Admin', path: '/' },
        { name: 'Containers', path: '/containerlist' },
        { name: 'Sign In', path: '/signin' },
        { name: 'Sign Up', path: '/signup' }
    ];

    return (
        <footer className="w-full bg-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Link to="/">
                    <img
                        src="/docker.svg"
                        alt="Docker Logo"
                        className="w-10 h-10 hover:opacity-80 transition-opacity"
                    />
                </Link>

                <nav className="w-full md:w-auto">
                    <ul className="flex flex-wrap justify-center gap-x-8">
                        {navItems.map((item) => (
                            <li key={item.name} className="mx-6">
                                <Link
                                    to={item.path}
                                    className="text-gray-400 hover:text-blue-800 transition-colors text-sm md:text-base"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="text-center">
                <p className="text-gray-500 text-sm md:text-base">
                    Docker Management.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                    © 2025 All rights reserved.
                </p>
            </div>
        </footer>
    );
};