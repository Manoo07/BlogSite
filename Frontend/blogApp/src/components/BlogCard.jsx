import React from 'react';

const BlogCard = ({ title, content,userName }) => {
  return (
    <div className="blog-card">
      <p className="text-gray-600"><b>Uploaded by:{userName}</b></p>
      <h2 className="text-2xl font-semibold mt-2 mb-4">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default BlogCard;
