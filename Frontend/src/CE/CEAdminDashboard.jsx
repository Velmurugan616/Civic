import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = import.meta.env.VITE_API_URL;

export const CEAdminDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  const [loggedUserData, setLoggedUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalComplaints: 0,
    statusCounts: {},
    categoryCounts: {}
  });

  useEffect(() => {
    if (!userId) navigate('/landing');
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userRes = await axios.get(`${BASE_URL}/user/viewuser/${userId}`);
        setLoggedUserData(userRes.data || {});
        const statsRes = await axios.get(`${BASE_URL}/complaint/stats`);
        setStats(statsRes.data?.stats || {});
      } catch (err) {
        console.error("Error loading admin data", err);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (loggedUserData?.role === 'user') {
      toast.error("You are not authorized to view this page.");
      navigate('/home');
    }
  }, [loggedUserData]);

  const logout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const statusData = Object.entries(stats?.statusCounts || {}).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(stats?.categoryCounts || {}).map(([name, value]) => ({ name, value }));

  const statusColors = ['#FF9F40', '#36A2EB', '#FF6384', '#4BC0C0'];
  const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC043'];

  if (loading) {
    return <div className="text-center text-xl font-semibold py-10">Loading Dashboard...</div>;
  }

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
            <div className="space-y-2">
              <Link to="/dashboard" className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition bg-[#00b9ff] text-white">📊 Dashboard</Link>
              <Link to="/complaints" className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition hover:bg-[#00b9ff] hover:text-white">⚖️ Complaints</Link>
              <Link to="/userlist" className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition hover:bg-[#00b9ff] hover:text-white">👤 User Management</Link>
              <Link to="/feedback" className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition hover:bg-[#00b9ff] hover:text-white">📄 Feedback</Link>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 pt-4">
            <p className="text-gray-700 font-semibold text-lg border-b border-gray-300">{loggedUserData?.name || "Admin"}</p>
            <button className="mt-3 w-full px-4 py-2 text-red-600 font-medium rounded-lg border border-red-500 hover:bg-red-500 hover:text-white" onClick={logout}>🚪 Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 bg-[#00B9FF]/50 overflow-y-auto">
          <div className="bg-white backdrop-blur-lg rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800">Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Complaints" value={stats.totalComplaints || 0} color="blue" />
              <StatCard label="Pending" value={stats.statusCounts?.Pending || 0} color="yellow" />
              <StatCard label="Resolved" value={stats.statusCounts?.Resolved || 0} color="green" />
              <StatCard label="Rejected" value={stats.statusCounts?.Rejected || 0} color="red" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Complaint Status Distribution" data={statusData} colors={statusColors} />
              <ChartCard title="Complaint Categories" data={categoryData} colors={categoryColors} />
            </div>

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
                          {stats.totalComplaints
                            ? ((category.value / stats.totalComplaints) * 100).toFixed(1) + '%'
                            : '0%'}
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

// 🟦 Subcomponents for clean code

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white p-4 rounded-lg shadow border-l-4 border-${color}-500`}>
    <h3 className="text-gray-500 text-sm">{label}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({ title, data, colors }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CEAdminDashboard;
