import React, { useEffect, useState } from 'react'
import celogofullpng from '../assets/celogofull.png'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;


export const CELogin = () => {

    const navigate = useNavigate();

    const userId = localStorage.getItem('id'); // Get the user id from local storage 

    const [logindata, setlogindata] = useState('')

    const change = (event) => {
        setlogindata({ ...logindata, [event.target.name]: event.target.value })
    }

    const submit = async (event) => {
        event.preventDefault()
        try {
            console.table(logindata)
            const response = await axios.post(`${BASE_URL}/user/login`, logindata);

            console.log(response);
            // console.log(response.data.token);
            localStorage.setItem("token", response.data.token);
            // console.log(localStorage.getItem("token"));
            localStorage.setItem("id", response.data.id);
            // console.log(localStorage.getItem("id"));
            toast.success(response.data.message);

            if (response.data.role === 'admin') {
                navigate('/dashboard');
            }
            else if (response.data.role === 'user') {
                navigate('/home');
            }
        }
        catch (error) {
            console.log("Error Occured", error);
            toast.error(error.response.data.message || error.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Toaster />

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Back button - visible on all screen sizes */}
                <div className="p-4">
                    <Link to="/landing">
                        <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                            <img
                                className="w-5 h-5"
                                src="https://img.icons8.com/?size=100&id=i6fZC6wuprSu&format=png&color=000000"
                                alt="Back"
                            />
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Branding */}
                    <div className="w-full md:w-5/12 p-6 md:p-10 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="max-w-xs">
                            <img className="w-48 md:w-56 mx-auto mb-8" src={celogofullpng} alt="Civic Eye Logo" />

                            <h2 className="text-xl md:text-2xl font-medium text-gray-800 text-center mb-3">
                                Welcome to CivicEye!
                            </h2>

                            <p className="text-gray-600 text-center text-sm md:text-base">
                                Your platform to report, track, and resolve public issues with ease.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Sign In Form */}
                    <div className="w-full md:w-7/12 p-6 md:p-10">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                                SIGN <span className="text-[#00B9FF]">IN</span>
                            </h2>

                            <form className="space-y-5" onSubmit={submit}>
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        onChange={change}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        onChange={change}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#00B9FF] text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors mt-6 focus:ring-4 focus:ring-blue-200"
                                >
                                    SIGN IN
                                </button>
                            </form>

                            <p className="text-gray-600 text-center mt-6">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-[#00B9FF] font-medium hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
