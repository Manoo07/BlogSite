
import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import axios from 'axios';

const HeroSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/blogs/pagewise/${page}`);
      setBlogs((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleScrollEvent = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <div className="flex flex-wrap">
      {/* <div className="container mx-auto flex flex-wrap justify-evenly"> */}
        {blogs.map((blog) => (
          <BlogCard key={blog.BlogID} title={blog.Title} content={blog.Content} userName={blog.UserName} />
        ))}
      {/* </div> */}
    </div>
    
  );
};

export default HeroSection;
