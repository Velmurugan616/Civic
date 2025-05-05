import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


export const CEAdminFeedback = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('id');

    useEffect(() => {
        if (!userId) {
            navigate('/landing');
        }
    }, []);

    const [loggedUserData, setLoggedUserData] = useState({}); // Loggedin user data
    const fetchLoggedUserData = async () => {
        try {
            if (!userId) return;
            const response = await axios.get(`http://127.0.0.1:6969/user/viewuser/${userId}`);
            if (response) {
                setLoggedUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    useEffect(() => {
        fetchLoggedUserData();
        // fetchUserData();
    }, []);

    useEffect(() => {
        if (loggedUserData.role === 'user') {
            toast.error("You are not authorized to view this page.");
            navigate('/home');
        }
    }, [loggedUserData]);



    const logout = () => {
        localStorage.clear()
        navigate('/signin')
    }

    const [feedbacks, setfeedbacks] = useState('') // feedbacks state
    const fetchfeedbacks = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:6969/feedback/getall`);
            if (response) {
                console.log("R", response.data);
                setfeedbacks(response.data);
            }

        }
        catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }
    // Fetch the user data when the component mounts
    useEffect(() => {
        fetchfeedbacks();
    }, []);


    const [feedbackUpdate, setFeedbackUpdate] = useState({ status: "" });

    const handleStatusChange = (event) => {
        setFeedbackUpdate({ ...feedbackUpdate, status: event.target.value });
    };

    const handleStatusSubmit = async (feedbackId, newStatus) => {
        try {
            const response = await axios.put(`http://127.0.0.1:6969/feedback/update/${feedbackId}`, {
                status: newStatus,
            });

            toast.success(`Feedback Status Updated`);
            fetchfeedbacks(); // Refresh feedback list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };


    
    return (
        <div className="w-full min-h-screen bg-gray-300 flex justify-center px-6 py-4">
            <Toaster />

            <div className="backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w flex overflow-hidden">

                {/* Sidebar */}
                <div className="bg-white/50 w-72 p-6 flex flex-col justify-between shadow-lg">

                    <div>
                        <div className="flex justify-center items-center mb-8">
                            <img src={celogofullpng} width="180" height="80" alt="Civic Eye Logo" className="drop-shadow-lg" />
                        </div>

                        <div className="space-y-2 ">
                            <Link
                                to="/dashboard"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                                📊 Dashboard
                            </Link>
                            <Link
                                to="/complaints"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                                ⚖️ Complaints
                            </Link>
                            <Link
                                to="/userlist"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                                👤 User Management
                            </Link>
                            <Link
                                to="/feedback"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 bg-[#00b9ff] text-white">
                                📄 Feedback
                            </Link>
                            {/* <Link
                    to=""
                    className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                    📄 Reports
                </Link> */}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">

                        {/* User Info & Logout */}
                        <div className="w-full text-center pt-4">
                            {/* User Name */}
                            <p className="text-gray-700 font-semibold text-lg border-b border-gray-300">{loggedUserData.name || "Admin"}</p>

                            {/* Logout Button */}
                            <button
                                className="mt-3 w-full px-4 py-2 text-red-600 font-medium rounded-lg border border-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                                onClick={logout}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 bg-[#00B9FF]/50">
                    <div className="bg-white backdrop-blur-lg rounded-xl shadow-md p-6">
                        <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800">User Feedbacks</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left h-full">
                                <thead>
                                    <tr className="text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                                        {["User Name", "Description", "Time Stamp", "Status", "Actions"].map((header, index) => (
                                            <th key={index} className="px-6 py-3 font-medium">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {feedbacks.length > 0 ? (
                                        feedbacks.map((feedback, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 text-gray-800 font-medium">{feedback.userName}</td>
                                                <td className="px-6 py-4 text-gray-600">{feedback.description}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {feedback.timestamp ? new Date(feedback.timestamp).toLocaleString('en-US', {
                                                        year: 'numeric', month: 'short', day: '2-digit',
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                                        hour12: true
                                                    }) : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{feedback.status}</td>
                                                <td className="px-6 py-4 text-gray-600 flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusSubmit(feedback._id, "Accepted")}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                    >
                                                        Accept
                                                    </button>

                                                    <button
                                                        onClick={() => handleStatusSubmit(feedback._id, "Rejected")}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>



                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="p-6 text-center text-lg font-medium text-gray-500">
                                                No feedback available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
