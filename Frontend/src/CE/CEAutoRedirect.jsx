// ./CE/CEAutoRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

export function CEAutoRedirect() {
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/signin');
      return;
    }

    const decoded = parseJwt(token);
    const userId = decoded?.userId;

    if (!userId) {
      navigate('/signin');
      return;
    }

    axios.get(`${BASE_URL}/user/viewuser/${userId}`)
      .then(res => {
        const role = res.data.role;
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      })
      .catch(() => {
        navigate('/signin');
      });
  }, []);

  return <div>Redirecting...</div>;
}
