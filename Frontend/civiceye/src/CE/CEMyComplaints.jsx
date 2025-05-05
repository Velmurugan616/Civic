import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import spinner from '../assets/spinner.gif';
import celogofullpng from '../assets/celogofull.png'; // Import the CivicEye Logo

const CEMyComplaints = () => {
    const navigate = useNavigate();
    const userid = localStorage.getItem('id'); // Get the user ID from local storage

    useEffect(() => {
        if (!userid) {
            navigate('/landing')
        }
    }, []);


    const [complaints, setComplaints] = useState([]); // State to store complaints
    const [filteredComplaints, setFilteredComplaints] = useState([]); // State for filtered complaints
    const [loading, setLoading] = useState(true); // State to handle loading
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState('All');
    const complaintsPerPage = 10;

    // Fetch complaints when the component mounts
    const fetchComplaints = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:6969/complaint/get/${userid}`);
            console.log(response.data);
            setComplaints(response.data);
            setFilteredComplaints(response.data);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);


    // Filter complaints based on status
    const filterComplaints = (status) => {
        setActiveFilter(status);
        setCurrentPage(1); // Reset to first page when filtering

        if (status === 'All') {
            setFilteredComplaints(complaints);
        } else {
            setFilteredComplaints(complaints.filter(complaint => complaint.status === status));
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




    // Pagination logic
    const indexOfLastComplaint = currentPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
    const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Function to determine filter button styles
    const getFilterButtonClass = (status) => {
        const baseClass = "px-4 py-2 text-md font-medium rounded-md transition duration-150 ";
        if (activeFilter === status) {
            return baseClass + "bg-[#00b9ff] text-white";
        }
        return baseClass + "bg-gray-100 text-gray-700 hover:bg-gray-200";
    };

    // Function to get status badge classes
    const getStatusBadgeClasses = (status) => {
        switch (status) {
            case "Pending":
                return "";
            case "Resolved":
                return "bg-emerald-100 text-emerald-800 border border-emerald-200";
            case "Rejected":
                return "bg-rose-100 text-rose-800 border border-rose-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8 md:px-6 md:py-10">
            {/* Header Section with Logo */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-8">
                {/* Logo - Left on Desktop, Centered on Mobile */}
                <div className="flex md:block justify-center md:ml-4">
                    <img
                        src={celogofullpng}
                        alt="Civic Eye Logo"
                        className="w-30 md:w-40 drop-shadow-sm"
                    />
                </div>

                {/* Heading - Centered on All Screens */}
                <div className="text-center md:flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Your Complaints
                    </h1>
                    <div className="h-1 w-full max-w-xs mx-auto bg-[#00b9ff] mt-4 rounded-full"></div>
                </div>

                {/* Empty Div for Spacing on Desktop */}
                <div className="hidden md:block w-40"></div>
            </div>



            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <img src={spinner} alt="Loading" className="w-16 h-16" />
                </div>
            ) : (
                <div className="w-full max-w-6xl">

                    {/* Stats Bar and Filter Buttons */}
                    <div className="bg-white shadow-md rounded-xl mb-6 p-4">

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="flex items-center justify-center hover:bg-gray-200 rounded-lg p-1 cursor-pointer">
                                <Link to="/home" className="w-6 h-6 space-x-1 hidden md:block">
                                    <img
                                        src="https://img.icons8.com/?size=100&id=84842&format=png&color=000000"
                                        alt="Icon"
                                    />
                                </Link>
                            </div>

                            {/* Filter Buttons */}
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4 md:mb-0">

                                <button
                                    onClick={() => filterComplaints('All')}
                                    className={getFilterButtonClass('All')}
                                >
                                    All ({complaints.length})
                                </button>
                                <button
                                    onClick={() => filterComplaints('Pending')}
                                    className={getFilterButtonClass('Pending')}
                                >
                                    Pending ({complaints.filter(c => c.status === "Pending").length})
                                </button>
                                <button
                                    onClick={() => filterComplaints('Resolved')}
                                    className={getFilterButtonClass('Resolved')}
                                >
                                    Resolved ({complaints.filter(c => c.status === "Resolved").length})
                                </button>
                                <button
                                    onClick={() => filterComplaints('Rejected')}
                                    className={getFilterButtonClass('Rejected')}
                                >
                                    Rejected ({complaints.filter(c => c.status === "Rejected").length})
                                </button>
                            </div>

                            {/* New Complaint Button */}
                            <Link
                                to="/home?showpopup=true"
                                className="flex items-center px-4 py-2 bg-[#00b9ff] text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                Submit New Complaint
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        {/* Complaints Table or Empty State */}
                        {filteredComplaints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} complaints found
                                </h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    {activeFilter !== 'All'
                                        ? `You don't have any ${activeFilter.toLowerCase()} complaints at the moment.`
                                        : "When you submit a complaint, it will appear here for you to track its status."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                            <th className="px-6 py-3 font-medium">Description</th>
                                            <th className="px-6 py-3 font-medium">Category</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Location</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentComplaints.map((complaint) => (
                                            <tr key={complaint._id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 text-gray-800 font-medium">
                                                    {complaint.description.length > 60
                                                        ? `${complaint.description.substring(0, 60)}...`
                                                        : complaint.description}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {complaint.type}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(complaint.status)}`}>
                                                        {complaint.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {complaint.location}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <a
                                                            href={complaint.proof}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                                                            title="View Proof"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                                                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                            </svg>
                                                            View
                                                        </a>
                                                        <button
                                                            onClick={() => downloadProof(complaint.proof)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition border border-gray-200"
                                                            title="Download Proof"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                                                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                                            </svg>
                                                            Download
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredComplaints.length > complaintsPerPage && (
                            <div className="flex justify-center py-4 border-t border-gray-100">
                                <nav className="flex items-center space-x-1">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-3 py-1 rounded border ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CEMyComplaints;