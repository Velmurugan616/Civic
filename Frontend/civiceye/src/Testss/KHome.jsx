import React, { useState, useEffect } from 'react';
import axios from 'axios';
import celogofullpng from '../assets/celogofull.png';
import spinner from '../assets/spinner.gif';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export const KHome = () => {
    const [activeTab, setActiveTab] = useState("📊 Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample data for demonstration
    const loggeduserdata = { name: "Admin User" };

    const users = [
        { name: "John Doe", email: "john@example.com", phone: "+91 9876543210", address: "123 Main St, City", idProof: "Verified", reports: 5, proof: "#" },
        { name: "Jane Smith", email: "jane@example.com", phone: "+91 9876543211", address: "456 Park Ave, Town", idProof: "Pending", reports: 3, proof: "#" },
        { name: "Robert Johnson", email: "robert@example.com", phone: "+91 9876543212", address: "789 Oak Rd, Village", idProof: "Verified", reports: 7, proof: "#" },
    ];

    const navItems = [
        { label: "📊 Overview", id: "overview" },
        { label: "⚖️ Complaints", id: "complaints" },
        { label: "👤 User Management", id: "users" },
        { label: "📄 Reports", id: "reports" },
        { label: "🗣️ Feedback", id: "feedback" }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Toaster position="top-right" />

            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="mr-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <img src={celogofullpng} alt="Civic Eye Logo" className="h-10" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{loggeduserdata.name}</span>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {loggeduserdata.name.charAt(0)}
                    </div>
                </div>
            </div>

            <div className="flex h-full">
                {/* Sidebar - Mobile overlay */}
                <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-30 lg:hidden transition-opacity duration-200 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={() => setSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <aside
                    className={`fixed lg:static inset-y-0 left-0 w-64 lg:w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="p-4 flex justify-center items-center border-b">
                            <img src={celogofullpng} width="180" height="80" alt="Civic Eye Logo" className="drop-shadow-sm" />
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.label);
                                            setSidebarOpen(false);
                                        }}
                                        className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 ${activeTab === item.label
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-base font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* User profile */}
                        <div className="p-4 border-t">
                            <div className="flex items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md text-white">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold mr-3">
                                    {loggeduserdata.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <div className="font-medium">{loggeduserdata.name}</div>
                                    <div className="text-xs text-blue-100">Administrator</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumb & Header */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                                <div className="text-sm text-gray-500">Manage and monitor user accounts</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    />
                                    <div className="absolute right-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
                                    Add New User
                                </button>
                            </div>
                        </div>

                        {/* Mobile Header */}
                        <div className="lg:hidden mb-4 space-y-3">
                            <h1 className="text-xl font-bold text-gray-800">User Management</h1>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    />
                                    <div className="absolute right-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: "Total Users", value: "1,254", change: "+12%", icon: "👥" },
                                { label: "Active Today", value: "857", change: "+3%", icon: "📱" },
                                { label: "Pending Verification", value: "24", change: "-2%", icon: "⏳" },
                                { label: "Reports Submitted", value: "432", change: "+18%", icon: "📊" }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                                        {stat.icon}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm text-gray-500">{stat.label}</div>
                                        <div className="flex items-center">
                                            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                                            <div className={`ml-2 text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.change}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* User Management Table Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-3">
                                <h2 className="text-lg font-semibold text-gray-800">Registered Users</h2>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                                        Export CSV
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                                        Print
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100">
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3 hidden md:table-cell">Contact</th>
                                            <th className="px-6 py-3 hidden lg:table-cell">Address</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 hidden sm:table-cell">Reports</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                        <div className="text-sm text-gray-900">{user.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">{user.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.idProof === "Verified"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                            }`}>
                                                            {user.idProof}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                                        {user.reports}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <button className="text-blue-600 hover:text-blue-900">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-900">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            <button className="text-blue-600 hover:text-blue-900 lg:hidden">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                        <span className="text-lg font-medium">No users found</span>
                                                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{" "}
                                            <span className="font-medium">12</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                1
                                            </button>
                                            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                2
                                            </button>
                                            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                3
                                            </button>
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                                <div className="flex sm:hidden justify-between w-full">
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Previous
                                    </button>
                                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
