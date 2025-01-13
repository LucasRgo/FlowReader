import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";

const AuthContext = React.createContext();
const csrfToken = Cookies.get('csrftoken');

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });


  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/register/', userData);
      if (response.status === 200) {
        setLastAction('register');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(
        error.response?.data?.detail ||
        'Username already in use. Please try again.'
      );
    }
  };

  const uploadPdf = async ( title, pdfFile, thumbnail ) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('pdf', pdfFile);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await axiosInstance.post('/api/upload-book/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 201) {
        console.log(response.data);
        return true;
      }
    } catch (error) {
      console.error('Error uploading book:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'An error occurred while uploading the book.');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/login/', credentials);
      if (response.status === 200) {
        window.location.reload();
      } else {
        setIsLoggedIn(false);
        throw new Error('Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || 'An error occurred during login. Please try again.');
    }
  };




  const logout = async () => {
    try {
      await axiosInstance.post('/api/logout/');
      setUser(null);
      setIsLoggedIn(false);
      setLastAction('logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(
        error.response?.data?.detail ||
        'An error occurred during logout. Please try again.'
      );
    }
  };




  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/api/user/');
      if (response.status === 200) {
        setUser(response.data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setIsLoggedIn(false);
      } else {
        console.error('Error fetching current user:', error);
      }
    } finally {
      setIsInitialized(true);
    }
  };



  useEffect(() => {
    if (lastAction === 'login' || lastAction === 'register') {
      fetchCurrentUser();
    }
  }, [lastAction]);

  useEffect(() => {
    if (!isInitialized) {
      fetchCurrentUser();
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <CircularProgress
          size={150}
          sx={{ color: 'orangered' }}
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, register, uploadPdf, axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
