// UserPage.js with Infinite Scrolling
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useUser } from './UserContext';
import UpdateComponent from './UpdateComponent'
import UserBlogCard from './UserBlogCrad'

const UserPage = () => {
  const { userId } = useUser();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
        setUser(userResponse.data);
        const postsResponse = await axios.get(`http://127.0.0.1:8000/blogs/pagewise/${userId}/${page}`);
        setPosts((prevPosts) => [...prevPosts, ...postsResponse.data]);
        // setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, page]);

  const handleDeleteBlog = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/blogs/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };
  const handleUpdateBlog = (blog)=>{
        console.log(blog.Title)
        console.log(blog.Content)
        console.log(blog.BlogID)
        navigate('/update-blog', {state: { blog }})
  }
  const handleUpdateUsername =()=>{

  }
  const handleUpdatePassword =()=>{

}

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-4">Hello {user.FirstName} {user.LastName}</h2>
      
      <div className="mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4" onClick={handleUpdateUsername}>
          Update Username
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4" onClick={handleUpdatePassword}>
          Update Password
        </button>
      </div>

      {posts.map((blog) => (
        <div key={blog.BlogID} className="mb-8">
          <UserBlogCard title={blog.Title} content={blog.Content} id={blog.BlogID} />
          <div className="mt-4">
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mr-4" onClick={() => handleUpdateBlog(blog)}>
              Update Blog
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4" onClick={() => handleDeleteBlog(blog.BlogID)}>
              Delete Blog
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPage;
