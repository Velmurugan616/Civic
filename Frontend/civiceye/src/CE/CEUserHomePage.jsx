import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'; // Import the Carousel Component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the Carousel CSS
import AOS from 'aos'; // Import the AOS Library
import 'aos/dist/aos.css'; // Import the AOS CSS
import celogofullpng from '../assets/celogofull.png' // Import the CivicEye Logo
import car1 from '../assets/carousel1.jpg' // Import the Carousel Image
import car2 from '../assets/carousel2.jpg' // Import the Carousel Image
import car3 from '../assets/carousel3.jpg' // Import the Carousel Image
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export const CEUserHomePage = () => {

    AOS.init(); // Initialize AOS Library
    const navigate = useNavigate();
    const userId = localStorage.getItem('id'); // Get the user id from local storage 
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("showpopup") === "true") {
            setPopupOpen(true);
        }
    }, [searchParams]);

    const [menuOpen, setMenuOpen] = useState(false);         // For mobile hamburger in navbar
    const [profileOpen, setProfileOpen] = useState(false);  // For desktop profile dropdown in navbar
    const [popupOpen, setPopupOpen] = useState(false);     // For complaint register popup
    const [loggeduserdata, setloggeduserdata] = useState(''); // For logged in user data

    const homeRef = useRef(null); // Ref for Home Section
    const aboutRef = useRef(null); // Ref for About Section
    const contactRef = useRef(null); // Ref for Contact Section

    //scroll to refs
    const scrollToAbout = () => {
        aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    const scrollToContact = () => {
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    const scrollToHome = () => {
        homeRef.current.scrollIntoView({ behavior: 'smooth' });
    }


    // redirect to landing page if user is not logged in
    useEffect(() => {
        if (!userId) {
            navigate('/landing')
        }
    }, []);

    // Fetch the logged user data from the backend
    const fetchUserData = async () => {
        try {
            if (!userId) return;
            const response = await axios.get(`http://127.0.0.1:6969/user/viewuser/${userId}`);
            if (response) {
                setloggeduserdata(response.data);
            }
            // if (response.data.role === 'admin') {
            //     navigate('/dashboard');
            // }

        }
        catch (error) {
            console.error('Error fetching user data:', error);
        }
    }


    // Complaint Data form state
    const [adddata, setadddata] = useState({
        description: "",
        location: "",
        type: "",
        proof: null,
        createdAt: new Date().toISOString(),
    });
    // Complaint Form Functions
    const compChange = (event) => {
        setadddata({ ...adddata, [event.target.name]: event.target.value })
    }
    const compfile = (event) => {
        setadddata({ ...adddata, proof: event.target.files[0] });
    };
    const compSubmit = async (event) => {
        setPopupOpen(false);
        event.preventDefault();

        const formData = new FormData();
        formData.append("description", adddata.description || "");
        formData.append("location", adddata.location || "");
        formData.append("type", adddata.type || "");
        formData.append("createdAt", adddata.createdAt);
        formData.append("userId", userId);

        // Append file correctly
        if (adddata.proof) {
            formData.append("proof", adddata.proof, adddata.proof.name);
        }

        // console.log("Submitted Data:", adddata);
        // console.log("FormData", formData);

        try {
            const response = await axios.post(`http://127.0.0.1:6969/complaint/add`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            toast.success(response.data);
            // console.log("Response:", response);
        } catch (error) {
            toast.error(error.response.data);
            console.error("Error submitting complaint:", error);
        }
    };


    // feedback 
    const [feedbacks, setfeedbacks] = useState('')
    const [feedbackData, setFeedbackData] = useState({ description: "" });

    //feedback fetch
    const fetchfeedbacks = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:6969/feedback/getall`);
            if (response) {
                // console.log("R", response.data);
                setfeedbacks(response.data);
            }

        }
        catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }

    // feedback input
    const feedbackchange = (event) => {
        setFeedbackData({ ...feedbackData, [event.target.name]: event.target.value });
    };

    // feedback submit
    const feedbacksubmit = async (event) => {
        event.preventDefault();
        const feedbackPayload = {
            userId: userId,
            description: feedbackData.description,
            timestamp: new Date().toISOString(), // Generate current timestamp
        };

        try {
            console.table(feedbackPayload);
            const response = await axios.post("http://127.0.0.1:6969/feedback/post", feedbackPayload);
            console.log(response);
            toast.success("Feedback submitted successfully!");
            setFeedbackData({ description: "" }); // Clear input after submission
            fetchfeedbacks();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error(error.response?.data?.message || "Failed to submit feedback");
        }
    };


    // Fetch the  data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
            await fetchComplaintStats();
            await fetchfeedbacks();
        };

        fetchData();
    }, []);


    // Logout function
    const logout = () => {
        localStorage.clear()
        nav('/landing')
    }

    //complaint stats 
    const [stats, setStats] = useState(null); // Initially set to null
    const fetchComplaintStats = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:6969/complaint/stats");
            if (response) {
                // console.log(response.data.stats);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Error fetching complaint stats:", error);
        }
    };


    return (
        <div ref={homeRef}>
            {/* Toast Notifications */}
            <Toaster />

            {/* Navbar */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md fixed top-0 w-full z-50">
                {/* Logo on the Left */}
                <div>
                    <Link to="/">
                        <img
                            src={celogofullpng}
                            width="160"
                            height="40"
                            alt="CivicEye Logo"
                            title="CivicEye"
                        />
                    </Link>
                </div>

                {/* Desktop Menu: Nav Links + Profile Dropdown */}
                <div className="hidden md:flex items-center space-x-4 ">
                    {/* Nav Links */}
                    <div className="flex space-x-4">
                        <Link onClick={scrollToHome} className="px-3 py-2 rounded text-gray-700 hover:bg-gray-200 transition">
                            Home
                        </Link>
                        <Link to="/mycomplaints" className="px-3 py-2 rounded text-gray-700 hover:bg-gray-200 transition">
                            My Complaints
                        </Link>
                        <Link onClick={scrollToAbout} className="px-3 py-2 rounded text-gray-700 hover:bg-gray-200 transition">
                            About
                        </Link>
                        <Link
                            onClick={scrollToContact} className="px-3 py-2 rounded text-gray-700 hover:bg-gray-200 transition">
                            Contact
                        </Link>
                    </div>

                    {/* Profile Dropdown Button */}
                    <div className="relative rounded text-gray-700 hover:bg-gray-200 transition">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center space-x-2 p-2 focus:outline-none"
                        >
                            <img
                                src="https://img.icons8.com/?size=100&id=7819&format=png&color=00B9FF"
                                alt="Profile Icon"
                                className="w-6 h-6 "
                            />
                            <span className="text-gray-700 font-normal">{loggeduserdata.name || "Account"} </span>
                            <img
                                src="https://img.icons8.com/?size=100&id=fZGbT6FrWkSx&format=png&color=000000"
                                alt="Down Arrow"
                                className="w-4 h-4"
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2">
                                <Link
                                    to="/myprofile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/myprofile?showDelete=true"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => { setProfileOpen(false), handleDelete() }}
                                >
                                    Delete Account
                                </Link>
                                <Link
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => { setProfileOpen(false), logout() }}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Section */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 focus:outline-none text-2xl">
                        {menuOpen ? "✖" : "☰"}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center md:hidden">
                        <Link to="/home" className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => { setMenuOpen(false), scrollToHome() }}>
                            Home
                        </Link>
                        <Link to="/mycomplaints" className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => setMenuOpen(false)}>
                            My Complaints
                        </Link>
                        <Link className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => { setMenuOpen(false), scrollToAbout() }}>
                            About
                        </Link>
                        <Link className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => { setMenuOpen(false), scrollToContact() }}>
                            Contact
                        </Link>
                        <hr className="w-full border-gray-200" />
                        <Link to="/myprofile" className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => setMenuOpen(false)}>
                            Profile
                        </Link>
                        <Link
                            to="/myprofile?showDelete=true"
                            className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => { setProfileOpen(false) }}
                        >
                            Delete Account
                        </Link>
                        <Link to="/signin" className="w-full text-center py-3 text-gray-700 hover:bg-gray-200"
                            onClick={() => { setProfileOpen(false), logout() }}>
                            Logout
                        </Link>
                    </div>
                )}
            </div>

            {/* Carousel  */}
            <Carousel
                className='h-[50vh] md:mt-20'
                autoPlay={true}
                showThumbs={false}
                showStatus={false}
                infiniteLoop={true}
                swipable={true}
                showIndicators={false}
                stopOnHover={false}
                interval={2000}>

                <div>
                    <img src={car1} className='object-contain h-[50vh]' />
                </div>
                <div>
                    <img src={car2} className='object-contain h-[50vh]' />
                </div>
                <div>
                    <img src={car3} className='object-contain h-[50vh]' />
                </div>

            </Carousel>

            {/* Register Complaints Full Screen Popup */}
            {popupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-gray-950/80 px-6">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={() => setPopupOpen(false)}
                            className="absolute top-4 right-4 focus:outline-none transition transform hover:scale-105 active:scale-95"
                        >
                            <img
                                src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000"
                                alt="Close"
                                className="w-6 h-6"
                            />
                        </button>
                        <div className="w-full max-w-2xl p-4 md:p-8 bg-white rounded-lg shadow-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-center text-gray-800">
                                Report an Issue
                            </h2>
                            <p className="mt-2 text-center text-gray-600">
                                Help us improve our community by reporting issues with detailed information.
                            </p>
                            <form className="mt-6 space-y-4" onSubmit={compSubmit}>
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id='description'
                                        name='description'
                                        onChange={compChange}
                                        rows="3"
                                        placeholder="Enter a detailed description"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-blue-500 focus:outline-none"
                                    ></textarea>
                                </div>
                                {/* Complaint Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Complaint Type
                                    </label>
                                    <select
                                        id='type'
                                        name='type'
                                        onChange={compChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option>Select complaint type</option>
                                        <option>Waste Dumping</option>
                                        <option>Infrastructure</option>
                                        <option>Public Nuisance</option>
                                        <option>Traffic Violations</option>
                                        <option>Water Leakage</option>
                                        <option>Power Outage</option>
                                        <option>Noise Complaint</option>
                                        <option>Road Damage</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        id='location'
                                        name='location'
                                        onChange={compChange}
                                        type="text"
                                        placeholder="Enter location"
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Media Upload */}
                                <div className='flex justify-between px-2'>
                                    <div>
                                        <p className="flex-col text-gray-600 text-md">Upload Media as proof</p>
                                        {adddata.proof && (
                                            <p className="mt-2 text-xs text-gray-600 text-pretty">
                                                Selected file: {adddata.proof.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="">
                                        {/* Hidden file input */}
                                        <input
                                            onChange={compfile}
                                            className="hidden"
                                            type="file"
                                            accept="image/*,video/*"
                                            id="media-upload"
                                            name='proof'
                                        />
                                        {/* Label acts as a button */}
                                        <label
                                            htmlFor="media-upload"
                                            className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition transform hover:scale-105 active:scale-95 focus:outline-none"
                                        >
                                            <span className="text-md">Upload</span>
                                            <img
                                                src="https://img.icons8.com/?size=100&id=5a1dAmxLxIS1&format=png&color=ffffff"
                                                alt="Upload Media"
                                                className="w-6 h-6"
                                            />
                                        </label>

                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        type="submit"
                                        className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition focus:outline-none"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setPopupOpen(false)}
                                        type="button"
                                        className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {/* Register Complaints Section */}
            <div className="p-16 mx-auto bg-gray-50 text-black">
                {/* Title */}
                <div className='mx-auto text-center'>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Register Complaints</h2>
                    <p className="text-gray-600 mb-6">Easily register your complaints and help us improve our community.</p>
                </div>

                {/* Register Complaints Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
                    {/* Button 1 */}
                    <button onClick={() => setPopupOpen(true)}
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md">
                        <div className="text-4xl mb-2">🗑️</div>
                        <span className="text-gray-700 text-lg font-semibold">Waste Dumping</span>
                    </button>


                    {/* Button 2 */}
                    <button onClick={() => setPopupOpen(true)}
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md">
                        <div className="text-4xl mb-2">⚠️</div>
                        <span className="text-gray-700 text-lg font-semibold">Public Nuisance</span>
                    </button>

                    {/* Button 3 */}
                    <button onClick={() => setPopupOpen(true)}
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md">
                        <div className="text-4xl mb-2">🚦</div>
                        <span className="text-gray-700 text-lg font-semibold">Traffic Violations</span>
                    </button>

                    {/* Button 4 */}
                    <button onClick={() => setPopupOpen(true)}
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md">
                        <div className="text-4xl mb-2">📄</div>
                        <span className="text-gray-700 text-lg font-semibold">Others</span>
                    </button>
                </div>

            </div>

            {/* Complaint Reports Section */}
            <div className="py-16 bg-gray-50">

                <div className="max-w-5xl mx-auto text-center">
                    {/* Section Heading */}
                    <h2
                        className="text-3xl font-extrabold text-gray-800 mb-6"
                        data-aos="fade-down"
                        data-aos-duration="800"
                    >
                        Complaint Reports
                    </h2>
                    <p
                        className="text-gray-600 mb-10 px-6"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        A quick overview of complaints registered, reports filed, and rewards distributed.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
                        {/* Complaints Registered */}
                        <div
                            className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            <h3 className="text-lg font-semibold text-gray-700">Complaints Registered</h3>
                            <p className="text-3xl font-bold text-blue-600">
                            {stats ? stats.totalComplaints : "Loading..."}
                            </p>
                        </div>

                        {/* Complaints Verified */}
                        <div
                            className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-500 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            data-aos="fade-up"
                            data-aos-duration="1200"
                        >
                            <h3 className="text-lg font-semibold text-gray-700">Complaints Verified</h3>
                            <p className="text-3xl font-bold text-green-600">
                            {stats ? stats.statusCounts?.Approved ?? 0 : "Loading..."}
                            </p>
                        </div>

                        {/* Complaints Resolved */}
                        <div
                            className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            data-aos="fade-up"
                            data-aos-duration="1400"
                        >
                            <h3 className="text-lg font-semibold text-gray-700">Complaints Resolved</h3>
                            <p className="text-3xl font-bold text-yellow-600">
                            {stats ? stats.statusCounts?.Resolved ?? 0 : "Loading..."}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* What We Do Section */}
            <div
                ref={aboutRef} className="text-center py-8 bg-gray-50">
                <div
                    className="text-3xl font-extrabold text-gray-800 mb-6"
                    data-aos="fade-down"
                    data-aos-duration="800"
                >
                    What We Do
                </div>

                <p
                    className="text-gray-600 mb-10 max-w-2xl mx-auto px-4 text-lg"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    Our process ensures transparency and efficiency in addressing issues. Here’s how we work to make your city a better place.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
                    <div
                        className="border-2 border-[#00B9FF] p-6 rounded-lg bg-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        data-aos="flip-left"
                        data-aos-duration="1000"
                    >
                        <div className="text-lg font-medium text-gray-700">You Register for Complaints</div>
                    </div>

                    <div
                        className="border-2 border-[#00B9FF] p-6 rounded-lg bg-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        data-aos="flip-right"
                        data-aos-duration="1200"
                    >
                        <div className="text-lg font-medium text-gray-700">Our Team Validates Your Complaint</div>
                    </div>

                    <div
                        className="border-2 border-[#00B9FF] p-6 rounded-lg bg-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        data-aos="flip-left"
                        data-aos-duration="1400"
                    >
                        <div className="text-lg font-medium text-gray-700">The Responsible Authority Acts</div>
                    </div>

                    <div
                        className="border-2 border-[#00B9FF] p-6 rounded-lg bg-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        data-aos="flip-right"
                        data-aos-duration="1600"
                    >
                        <div className="text-lg font-medium text-gray-700">Then Here’s a Reward for You</div>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <div className="py-16 text-center bg-gray-50 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">What Our Users Say</h2>

                {/* Testimonial Carousel */}
                <Carousel
                    className="max-w-xl flex flex-col justify-center items-center py-4"
                    autoPlay
                    interval={3000}
                    infiniteLoop
                    showIndicators={false}
                    showArrows={false}
                    showThumbs={false}
                    showStatus={false}
                    swipeable
                    stopOnHover={false}
                >
                    {feedbacks.length > 0 ? (
                        feedbacks
                            .filter((feedback) => feedback.status === "Accepted") // Only show "Accepted" feedbacks
                            .slice()
                            .reverse()
                            .map((feedback) => (
                                <div key={feedback._id} className="bg-white p-6 md:p-8 rounded-xl shadow-md my-2 mx-4 text-center">
                                    <p className="text-gray-700 text-lg leading-relaxed italic">
                                        "{feedback.description || "User Friendly"}"
                                    </p>
                                    <p className="text-[#00B9FF] font-semibold text-base mt-3">
                                        - {feedback.userName || "Random User"}
                                    </p>
                                </div>
                            ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No feedback available.
                        </div>
                    )}
                </Carousel>


                {/* Feedback Input */}
                <div className="mt-1 flex">
                    <form onSubmit={feedbacksubmit}>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={feedbackData.description}
                            onChange={feedbackchange}
                            placeholder="Write your feedback"
                            className="border border-gray-300 p-2 rounded-lg"
                        />  
                        <button type='submit' className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {/* Support Section */}
            <div
                ref={contactRef} className="py-12 bg-gray-50 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Need Help? Contact Us</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full px-6">
                    {/* Support Mail */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 text-center">
                        <div className="flex flex-col items-center">
                            <img className="w-10 h-10"
                                src="https://img.icons8.com/?size=100&id=83161&format=png&color=2b7fff" alt="Email" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Support Mail</h3>
                            <p className="text-gray-600 mt-1">For any assistance,</p>
                            <p className="text-gray-600 mt-1">contact our support team.</p>
                            <p className="text-blue-600 font-medium mt-2">support@civiceye.com</p>
                        </div>
                    </div>

                    {/* Support Call */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-500 text-center">
                        <div className="flex flex-col items-center">
                            <img
                                className="w-10 h-10" src="https://img.icons8.com/?size=100&id=87292&format=png&color=00c951" alt="Email" />

                            <div>
                                <h3 className="text-xl font-semibold text-gray-700">Make A Call</h3>
                                <p className="text-gray-600 mt-1">Need help?</p>
                                <p className="text-gray-600 mt-1">Give us a call anytime.</p>
                                <p className="text-green-600 font-medium mt-2">+123 456 7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#1A1A1A] text-white py-6">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">

                    {/* Content Grid - Centered */}
                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                        {/* Quick Links */}
                        <div className=''>
                            <h3 className="text-lg font-semibold pl-2">
                                <span className='border-l-4 border-[#00B9FF]'> </span>
                                Quick Links</h3>
                            <ul className="ml-4 mt-2 space-y-2">
                                <li>
                                    <Link to="/home" className="flex items-center justify-center md:justify-start space-x-2 hover:text-[#00B9FF]"><span>▪</span>
                                        <span>Home</span></Link>
                                </li>
                                <li>
                                    <Link to="/mycomplaints" className="flex items-center justify-center md:justify-start space-x-2 hover:text-[#00B9FF]"><span>▪</span>
                                        <span>My Complaints</span></Link>
                                </li>
                                <li>
                                    <Link to="/myprofile" className="flex items-center justify-center md:justify-start space-x-2 hover:text-[#00B9FF]"><span>▪</span>
                                        <span>Profile</span></Link>
                                </li>
                                <li>
                                    <Link
                                        onClick={() => logout()}
                                        to="/signin" className="flex items-center justify-center md:justify-start space-x-2 hover:text-[#00B9FF]"><span>▪</span>
                                        <span>Logout</span></Link>
                                </li>
                            </ul>
                        </div>
                        {/* Phone Numbers */}
                        <div>
                            <h3 className="text-lg font-semibold pl-2">
                                <span className='border-l-4 border-[#00B9FF]'> </span>
                                Phone Numbers</h3>
                            <div className='ml-4'>
                                <p className="mt-2">
                                    <span className="font-semibold">Military</span> <br />
                                    (123) 456-7540
                                </p>
                                <p className="mt-4">
                                    <span className="font-semibold">State Police</span> <br />
                                    (123) 456-7891
                                </p>
                                <p className="mt-4">
                                    <span className="font-semibold">Fire Department</span> <br />
                                    (123) 456-7892
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold pl-2">
                                <span className='border-l-4 border-[#00B9FF]'> </span>
                                Contact Info</h3>
                            <div className='ml-4'>
                                <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                                    <span>📍</span>
                                    <a href="https://maps.app.goo.gl/Pn36ysUuiPzKB3qu5" >CivicEye</a>
                                </div>
                                <div className="mt-4 flex items-center justify-center md:justify-start space-x-2">
                                    <span>📞</span>
                                    <a href="tel:+91 9037-29-1113" > +91 9037-29-1113</a>
                                </div>
                                <div className="mt-4 flex items-center justify-center md:justify-start space-x-2">
                                    <span>✉️</span>
                                    <span>info@civiceye.com</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Copyright - Centered */}
                    <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4 w-full max-w-5xl">
                        © CivicEye 2025 | Empowering Citizens, Improving Communities.
                    </div>
                </div>
            </footer>

        </div >
    )
}
