import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const CEAdminUserManagement = () => {

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



  const [users, setUsers] = useState([]); // All users data list
  const fetchUserData = async () => {
    try {
      if (!userId) return;
      const response = await axios.get(`http://127.0.0.1:6969/user/viewall/${userId}`);
      if (response) {
        setUsers(response.data.users);
        // console.log(users);

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchLoggedUserData();
    fetchUserData();
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
                className="flex items-center px-6 py-3 text-lg font-medium w-full rounded-lg transition duration-300 bg-[#00b9ff] text-white">
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

        {/* Main Content */}
        <div className="flex-1 p-10 bg-[#00B9FF]/50">
          <div className="bg-white backdrop-blur-lg rounded-xl shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800">User Management</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                    {["Name", "Email", "Phone", "Address", "State", "Role"].map((header, index) => (
                      <th key={index} className="px-6 py-3 font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 text-gray-800 font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{user.mobile}</td>
                        <td className="px-6 py-4 text-gray-600">{user.address || "Not Provided"}</td>
                        <td className="px-6 py-4 text-gray-600">{user.state || "Not Provided"}</td>
                        <td className="px-6 py-4 text-gray-600">{user.role}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-lg font-medium text-gray-500">
                        No users found.
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
  );
};
