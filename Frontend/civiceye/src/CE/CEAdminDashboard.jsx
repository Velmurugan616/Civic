import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export const CEAdminDashboard = () => {
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
      const response = await axios.get(`${BASE_URL}/user/viewuser/${userId}`);
      if (response) {
        setLoggedUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchLoggedUserData();
    fetchComplaintStats();
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

  //complaint stats 
  const [stats, setStats] = useState({
    totalComplaints: 0,
    statusCounts: {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Resolved: 0
    },
    categoryCounts: {
      "Water Leakage": 0,
      "Traffic Violations": 0,
      "Power Outage": 0,
      "Infrastructure": 0,
      "Other": 0,
      "Public Nuisance": 0,
      "Waste Dumping": 0
    },
    last7DaysCount: 0
  });

  const fetchComplaintStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/complaint/stats`);
      if (response) {
        setStats(response.data.stats);
        console.log(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching complaint stats:", error);
    }
  };

  // Prepare data for charts
  const statusData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(stats.categoryCounts).map(([name, value]) => ({ name, value }));

  // Colors for the pie charts
  const statusColors = ['#FF9F40', '#36A2EB', '#FF6384', '#4BC0C0'];
  const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC043'];

  // Activity data (mock data for now since no actual timeline data is provided)
  const activityData = [
    { day: 'Mon', complaints: 2 },
    { day: 'Tue', complaints: 3 },
    { day: 'Wed', complaints: 1 },
    { day: 'Thu', complaints: 4 },
    { day: 'Fri', complaints: 2 },
    { day: 'Sat', complaints: 1 },
    { day: 'Sun', complaints: 0 },
  ];

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
                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 bg-[#00b9ff] text-white">
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
                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 hover:bg-[#00b9ff] hover:text-white">
                📄 Feedback
              </Link>
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
        <div className="flex-1 p-10 bg-[#00B9FF]/50 overflow-y-auto">
          <div className="bg-white backdrop-blur-lg rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800">Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm">Total Complaints</h3>
                <p className="text-3xl font-bold">{stats.totalComplaints}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm">Pending</h3>
                <p className="text-3xl font-bold">{stats.statusCounts.Pending}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm">Resolved</h3>
                <p className="text-3xl font-bold">{stats.statusCounts.Resolved}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm">Rejected</h3>
                <p className="text-3xl font-bold">{stats.statusCounts.Rejected}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Complaint Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Complaint Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            {/* <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="complaints" fill="#00B9FF" />
                </BarChart>
              </ResponsiveContainer>
            </div> */}

            {/* Category Table */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Complaint Categories Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Category</th>
                      <th className="py-2 px-4 border-b text-left">Count</th>
                      <th className="py-2 px-4 border-b text-left">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{category.name}</td>
                        <td className="py-2 px-4 border-b">{category.value}</td>
                        <td className="py-2 px-4 border-b">
                          {((category.value / stats.totalComplaints) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CEAdminDashboard;