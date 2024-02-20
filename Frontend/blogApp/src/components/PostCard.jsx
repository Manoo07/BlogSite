
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
const PostCard = () => {
  const navigate = useNavigate();
  const [Title, setTitle] = useState('');
  const [Content, setContent] = useState('');
  const { userId } = useUser();

  const handlePost = async () => {
    
    try {
      const response = await axios.post(`http://127.0.0.1:8000/blogs/${userId}`, {
        Title,
        Content,
      });
      console.log('Post successful:', response.data);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error posting:', error);
    }
    navigate('/')
  };

  return (
    <div className="max-w-md mx-auto my-4 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Post Your Thoughts</h2>
      <label htmlFor="title" className="block text-gray-700">Title:</label>
      <input
        type="text"
        id="title"
        value={Title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />

      <label htmlFor="content" className="block text-gray-700 mt-2">Content:</label>
      <textarea
        id="content"
        value={Content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />

      <button onClick={handlePost} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">Post</button>
    </div>
  );
};

export default PostCard;
