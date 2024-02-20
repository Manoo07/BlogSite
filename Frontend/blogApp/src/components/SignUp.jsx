
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
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
      const response = await axios.post('http://127.0.0.1:8000/users', formData);
      console.log('User signed up successfully!', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          First Name:
        </label>
        <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"  />
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
            Last Name:
            </label>
            <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" 
           />
        </div>
        <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Email:
        </label>
        <input type="email" name="Email" value={formData.Email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Password:
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"/>
        </label>
        </div>
        <br />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Sign Up</button>
        </div>
      
      </form>
      <br />
      <div className="mt-4">
        <Link to="/sign-in" className="text-blue-500 hover:underline">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
