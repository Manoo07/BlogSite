import React from 'react';

const UserBlogCard = ({ title, content,id}) => {
  return (
    <div className="blog-card">
      <h2 className="text-2xl font-semibold mt-2 mb-4">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default UserBlogCard;