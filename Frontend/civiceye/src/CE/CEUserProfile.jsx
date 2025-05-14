import React, { useState, useEffect } from 'react';
import axios from 'axios';
import celogofullpng from '../assets/celogofull.png';
import spinner from '../assets/spinner.gif';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export const CEUserProfile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userid = localStorage.getItem('id');

    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    // Check URL parameters for delete popup
    useEffect(() => {
        if (searchParams.get("showDelete") === "true") {
            setPopupOpen(true);
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        dob: '',
        password: '',
        address: ''
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!userid) {
            navigate('/landing');
        }
    }, [navigate, userid]);

    // Fetch user data
    const fetchUserData = async () => {
        try {
            if (!userid) return;
            const response = await axios.get(`${BASE_URL}/user/viewuser/${userid}`);
            if (response) {
                setFormData({
                    name: response.data.name || '',
                    mobile: response.data.mobile || '',
                    email: response.data.email || '',
                    dob: response.data.dob || '',
                    address: response.data.address || '',
                    state: response.data.state
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userid]);

    // Handle form data change
    const change = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Update user data
    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL}/user/update/${userid}`, formData);
            toast.success(response.data.message);
            fetchUserData();
        } catch (error) {
            console.log("CL", error);
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    // Delete account
    const deleteAccount = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/user/delete/${userid}`);
            toast.success(response.data.message);
            setPopupOpen(false);
            logout();
            toast.success('Account deleted successfully');
            setTimeout(() => {
                navigate('/landing');
            }, 1000);
        } catch (error) {
            console.log("CL", error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };
    const logout = () => {
        localStorage.clear()
        nav('/landing')
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6">
            <Toaster position="top-right" />

            {/* Header with logo */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-8">
                {/* Logo - Left on Desktop, Centered on Mobile */}
                <Link to="/home" className="flex md:block justify-center md:ml-4">
                    <img
                        src={celogofullpng}
                        alt="Civic Eye Logo"
                        className="w-30 md:w-40 drop-shadow-sm hover:opacity-90 transition-opacity"
                    />
                </Link>

                {/* Heading - Centered on All Screens */}
                <div className="text-center md:flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                        My Profile
                    </h1>
                    <div className="h-1 w-full max-w-xs mx-auto bg-[#00B9FF] mt-4 rounded-full"></div>
                </div>

                {/* Empty Div for Spacing on Desktop */}
                <div className="hidden md:block w-40"></div>
            </div>


            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Main content card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Card header */}
                    <div className="bg-[#00b9ff] shadow-md text-white px-6 py-5">
                        <h2 className="text-xl md:text-2xl font-semibold">
                            Personal Information
                        </h2>
                        <p className="text-sm md:text-base opacity-90 mt-1">
                            Update your profile details below
                        </p>
                    </div>

                    {/* Card body */}
                    <div className="p-4 sm:p-6 md:p-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <img src={spinner} alt="Loading..." className="w-14 h-14 mb-3" />
                                <p className="text-gray-600 font-medium animate-pulse">Loading your profile...</p>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formData.name || ''}
                                                placeholder="Your full name"
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="mobile">
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                id="mobile"
                                                placeholder="Your mobile number"
                                                value={formData.mobile || ''}
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="Your email address"
                                                value={formData.email || ''}
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* DOB */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dob">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                name="dob"
                                                id="dob"
                                                value={formData.dob || ''}
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="Update password"
                                                value={formData.password}
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="state">
                                            State
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="state"
                                                id="state"
                                                value={formData.state || ''}
                                                placeholder="Your State"
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <textarea
                                                name="address"
                                                id="address"
                                                rows="3"
                                                placeholder="Your full address"
                                                value={formData.address || ''}
                                                onChange={change}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b9ff] focus:border-[#00b9ff] outline-none transition resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mt-8 pt-5 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setPopupOpen(true)}
                                        className="order-2 sm:order-1 px-6 py-3 bg-white border border-red-500 text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Delete Account
                                    </button>

                                    <button
                                        type="submit"
                                        className="order-1 sm:order-2 px-6 py-3 bg-[#00b9ff] text-white rounded-lg shadow-md hover:bg-[#00a6e6] transition duration-200 focus:ring-2 focus:ring-[#00b9ff] focus:ring-opacity-50 focus:outline-none flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {popupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/75">
                    <div className="relative max-w-md w-full mx-4 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-red-600">
                                    Delete Account
                                </h2>
                                <button
                                    onClick={() => setPopupOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col items-center justify-center text-center mb-6">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
                                    <p className="text-gray-600 mt-2">
                                        This will permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center gap-3">
                                    <button
                                        onClick={() => setPopupOpen(false)}
                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteAccount}
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                                    >
                                        Delete Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};