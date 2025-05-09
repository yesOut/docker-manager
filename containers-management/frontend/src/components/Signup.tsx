import React, { JSX, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Example(): JSX.Element {
    let pathname;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        state: '',
        phoneNumber: '',
        role: 'user'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Passwords do not match" });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await axios.post(
                'http://localhost:4200/api/auth/register',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );

            if (response.status === 201) {
                navigate('/signin');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const newErrors: Record<string, string> = {};
                error.response.data.errors.forEach((err: any) => {
                    newErrors[err.path] = err.msg;
                });
                setErrors(newErrors);
            } else {
                console.error('Registration error:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };


    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="/public/docker.svg"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                                    Country
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="country"
                                        name="country"
                                        type="text"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        autoComplete="country"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.country && (
                                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
                                    State
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        autoComplete="state"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.state && (
                                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm/6 font-medium text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    placeholder="(+216)"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}