import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useUser } from './UserContext'; 

const SignIn = () => {
    const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/sign-in', formData);
      console.log('User signed in successfully!', response.data);
      updateUser(response.data.UserId);
      navigate('/'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email:</label>
                <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md"/>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password:</label>
                <input type="password" name="Password" value={formData.Password} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md"/>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Sign In</button>
            </form>
            <br />
            <div className="mt-4">
                <Link to="/sign-up" className="text-blue-500 hover:underline">
                    Don't have an account? Sign Up
                </Link>
        </div>
        </div>
    </div>
    
  );
};

export default SignIn;
