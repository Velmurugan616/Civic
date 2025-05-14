import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import spinner from '../assets/spinner.gif';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export const CEAdminComplaints = () => {

    const navigate = useNavigate();
    const userId = localStorage.getItem('id');

    const [loading, setLoading] = useState(true); // Loading state
    const [loggedUserData, setLoggedUserData] = useState({}); // Loggedin user data

    useEffect(() => {
        if (!userId) {
            navigate('/landing');
        }
    }, []);

    const fetchLoggedUserData = async () => {
        try {
            if (!userId) return;
            const response = await axios.get(`${BASE_URL}user/viewuser/${userId}`);
            if (response) {
                setLoggedUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const [complaintlist, setcomplaintlist] = useState([])
    const fetchComplaintData = async () => {
        try {
            if (!userId) return;
            const response = await axios.get(`${BASE_URL}/complaint/getall/${userId}`);
            if (response) {
                // console.log(response.data);
                // setcomplaintlist(response.data);
                setcomplaintlist([...response.data].reverse());
                setLoading(false)


            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    useEffect(() => {
        fetchLoggedUserData();
        fetchComplaintData();
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

    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState("All");
    const complaintsPerPage = 5;

    const filterComplaints = (status) => {
        setActiveFilter(status);
        setCurrentPage(1);

        if (status === "All") {
            setFilteredComplaints(complaintlist);
        } else {
            setFilteredComplaints(complaintlist.filter(complaint => complaint.status === status));
        }
    };

    useEffect(() => {
        if (complaintlist.length > 0) {
            filterComplaints("All"); // Populate list immediately after data is fetched
        }
    }, [complaintlist]);

    // status update logic
    const [activeRowId, setActiveRowId] = useState(null);
    const [statusdropdown, setstatusdropdown] = useState(false);
    const [updatedata, setupdatedata] = useState({ status: "" });

    const statusupdatechange = (event) => {
        setupdatedata({ ...updatedata, status: event.target.value });
    };
    const statusupdatesubmit = async (event, complaintId) => {
        event.preventDefault();

        if (!updatedata.status) {
            return toast.error("Please select a status!");
        }
        try {
            const response = await axios.put(`${BASE_URL}/complaint/update/${complaintId}`, {
                status: updatedata.status,
            });

            toast.success(response.data.message);
            setstatusdropdown(false); // Close dropdown
            setActiveRowId(null); // Reset active row
            fetchComplaintData(); // Refresh complaint data

        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const downloadProof = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Failed to fetch file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileUrl.split("/").pop(); // Extract filename from URL
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Download failed. Try again.");
        }
    };



    // Pagination Logic
    const indexOfLastComplaint = currentPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
    const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Function for Filter Button Styles
    const getFilterButtonClass = (status) => {
        const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition duration-150 ";
        return activeFilter === status ? baseClass + "bg-blue-600 text-white" : baseClass + "bg-gray-100 text-gray-700 hover:bg-gray-200";
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
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 bg-[#00b9ff] text-white">
                                ⚖️ Complaints
                            </Link>
                            <Link
                                to="/userlist"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                                👤 User Management
                            </Link>
                            <Link
                                to="/feedback"
                                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
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
                {/* Main */}
                <div className="flex-1 p-10 bg-[#00B9FF]/50">
                    <div className="bg-white backdrop-blur-lg rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800">Complaints</h2>

                        {/* Loading Spinner */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <img src={spinner} alt="Loading" className="w-16 h-16" />
                            </div>
                        ) : (
                            <>
                                {/* Filter Buttons */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <button onClick={() => filterComplaints("All")} className={getFilterButtonClass("All")}>
                                        All ({complaintlist.length})
                                    </button>
                                    <button onClick={() => filterComplaints("Pending")} className={getFilterButtonClass("Pending")}>
                                        Pending ({complaintlist.filter(c => c.status === "Pending").length})
                                    </button>
                                    <button onClick={() => filterComplaints("Approved")} className={getFilterButtonClass("Approved")}>
                                        Approved ({complaintlist.filter(c => c.status === "Approved").length})
                                    </button>
                                    <button onClick={() => filterComplaints("Resolved")} className={getFilterButtonClass("Resolved")}>
                                        Resolved ({complaintlist.filter(c => c.status === "Resolved").length})
                                    </button>
                                    <button onClick={() => filterComplaints("Rejected")} className={getFilterButtonClass("Rejected")}>
                                        Rejected ({complaintlist.filter(c => c.status === "Rejected").length})
                                    </button>
                                </div>


                                {/* Complaints Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left h-full">
                                        <thead>
                                            <tr className="text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                                                {["Description", "Location", "Type", "Time Stamp", "Status", "Resolved Date", "Actions"].map((header, index) => (
                                                    <th key={index} className="px-6 py-3 font-medium">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentComplaints.length > 0 ? (
                                                currentComplaints.map((com, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                        <td className="px-6 py-4 text-gray-800 font-medium">{com.description}</td>
                                                        <td className="px-6 py-4 text-gray-600">{com.location}</td>
                                                        <td className="px-6 py-4 text-gray-600">{com.type}</td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {com.createdAt ? new Date(com.createdAt).toLocaleString('en-US', {
                                                                year: 'numeric', month: 'short', day: '2-digit',
                                                                hour: '2-digit', minute: '2-digit', second: '2-digit',
                                                                hour12: true
                                                            }) : "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">{com.status}</td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {com.resolvedAt ? new Date(com.resolvedAt).toLocaleString('en-US', {
                                                                year: 'numeric', month: 'short', day: '2-digit',
                                                                hour: '2-digit', minute: '2-digit', second: '2-digit',
                                                                hour12: true
                                                            }) : "Not Resolved"}
                                                        </td>

                                                        <td className="px-6 py-4 text-center">
                                                            {com.proof ? (
                                                                <div className="flex gap-2">
                                                                    {/* View Proof Button */}
                                                                    <a
                                                                        href={com.proof}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex justify-center items-center w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                                                    >
                                                                        <img className="w-6 h-6" src="https://img.icons8.com/?size=100&id=84871&format=png&color=FFFFFF" />
                                                                    </a>

                                                                    {/* Download Proof Button */}
                                                                    <button
                                                                        onClick={() => downloadProof(com.proof)}
                                                                        className="inline-flex justify-center items-center w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                                                    >
                                                                        <img className="w-6 h-6" src="https://img.icons8.com/?size=100&id=82829&format=png&color=FFFFFF" />
                                                                    </button>


                                                                    {/* Update Status Button */}
                                                                    <div
                                                                        onClick={() => {
                                                                            setActiveRowId(com._id);
                                                                            setstatusdropdown(true);
                                                                        }}
                                                                        className="inline-flex justify-center items-center w-10 h-10 bg-blue-500 rounded-lg hover:bg-blue-600 transition cursor-pointer relative"
                                                                    >
                                                                        <img className="w-6 h-6" src="https://img.icons8.com/?size=100&id=82811&format=png&color=FFFFFF" />

                                                                        {/* Popup Dropdown - Only shown if this is the active row */}
                                                                        {statusdropdown && activeRowId === com._id && (
                                                                            <>
                                                                                {/* Lightweight overlay to capture clicks outside */}
                                                                                <div
                                                                                    className="fixed inset-0 z-50"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();    // Prevents dropdown from closing when clicking inside
                                                                                        setstatusdropdown(false);
                                                                                        setActiveRowId(null);
                                                                                    }}
                                                                                ></div>

                                                                                {/* Popup - positioned below button */}
                                                                                <form

                                                                                    onSubmit={(e) => statusupdatesubmit(e, com._id)}
                                                                                    className="z-60  absolute top-12 right-0 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition-all duration-150 origin-top-right"
                                                                                >
                                                                                    {/* Arrow pointing top */}
                                                                                    <div className="absolute top-0 right-4 h-3 w-3 bg-white transform rotate-45 -translate-y-1.5 border-l border-t border-gray-200"></div>

                                                                                    <h3 className="text-sm font-medium mb-2 text-gray-700">Update Complaint Status</h3>

                                                                                    {/* Select Dropdown */}
                                                                                    <select
                                                                                        id="status"
                                                                                        name="status"
                                                                                        onChange={statusupdatechange}
                                                                                        className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                                                    >
                                                                                        <option value="">Select Status</option>
                                                                                        <option value="Pending">Pending</option>
                                                                                        <option value="Approved">Approved</option>
                                                                                        <option value="Resolved">Resolved</option>
                                                                                        <option value="Rejected">Rejected</option>
                                                                                    </select>

                                                                                    {/* Buttons */}
                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setstatusdropdown(false);
                                                                                                setActiveRowId(null);
                                                                                            }}

                                                                                            type="button"
                                                                                            className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                                                                        >
                                                                                            Cancel
                                                                                        </button>
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                                                                        >
                                                                                            Submit
                                                                                        </button>
                                                                                    </div>
                                                                                </form>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500">No Proof</span>
                                                            )}
                                                        </td>


                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="p-6 text-center text-lg font-medium text-gray-500">
                                                        No complaints found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredComplaints.length > complaintsPerPage && (
                                    <div className="flex justify-center py-4 border-t border-gray-100">
                                        <nav className="flex items-center space-x-1">
                                            <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                                Previous
                                            </button>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <button key={index} onClick={() => paginate(index + 1)} className={`px-3 py-1 rounded border ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
