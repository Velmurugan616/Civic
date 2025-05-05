import React, { useEffect, useState } from "react";
import celogofullpng from '../assets/celogofull.png'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export const CESignup = () => {
  const navigate = useNavigate();
  const [signindata, setsignindata] = useState('')
  const userId = localStorage.getItem('id'); // Get the user id from local storage 

  // Redirect to home page if user is already logged in
  useEffect(() => {
    if (userId) {
      navigate('/home')
    }
  }, []);
  const change = (event) => {
    setsignindata({ ...signindata, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      console.table(signindata)
      let response = await axios.post('http://127.0.0.1:6969/user/register', signindata)
      console.log(response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/signin');
      }, 1000);

    }
    catch (error) {
      console.log("CL", error.response.data.message);
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
              <img
                className="w-48 md:w-56 mx-auto mb-8"
                src={celogofullpng}
                alt="Civic Eye Logo"
              />

              <h2 className="text-xl md:text-2xl font-medium text-gray-800 text-center mb-3">
                Welcome to CivicEye!
              </h2>

              <p className="text-gray-600 text-center text-sm md:text-base">
                Your platform to report, track, and resolve public issues with ease.
              </p>
            </div>
          </div>

          {/* Right Section - Sign Up Form */}
          <div className="w-full md:w-7/12 p-6 md:p-10">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                SIGN <span className="text-[#00B9FF]">UP</span>
              </h2>

              <form className="space-y-5" onSubmit={submit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    onChange={change}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    pattern="^[6-9]\d{9}$"
                    placeholder="Mobile Number"
                    onChange={change}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    onChange={change}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                    placeholder="Date of Birth"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

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

                <button
                  type="submit"
                  className="w-full bg-[#00B9FF] text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors mt-6 focus:ring-4 focus:ring-blue-200"
                >
                  SIGN UP
                </button>
              </form>

              <p className="text-gray-600 text-center mt-6">
                Already have an account?{" "}
                <Link to="/signin" className="text-[#00B9FF] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
