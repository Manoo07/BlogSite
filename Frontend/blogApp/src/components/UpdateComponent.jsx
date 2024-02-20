import axios from 'axios';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const UpdateComponent = () => {
  const {state} = useLocation();
  const { Title, Content, BlogID } = state.blog;
  const [updatedTitle, setUpdatedTitle] = useState(Title);
  const [updatedContent, setUpdatedContent] = useState(Content);
  const [updatedId,setUpdatedId] = useState(BlogID)

  const updateHandler = async() => {
    console.log("Updated Title:", updatedTitle);
    console.log("Updated Content:", updatedContent);
    try{
      console.log(updatedId)
      const response = await axios.put(`http://127.0.0.1:8000/blogs/${updatedId}`,{
        Title:updatedTitle,
        Content:updatedContent
      })
      console.log(response);
    }
    catch(err){
      console.log("Error in updating",err)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <label className="block text-sm font-semibold mb-2">Update Title</label>
      <br></br>
      <input
        type="text"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
      />

      <label className="block mt-4 text-sm font-semibold mb-2">Update Content</label>
      <textarea
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
        className="w-full h-32 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
      />
      <br></br>
      <button onClick={updateHandler} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Update the Blog</button>
    </div>
  );
};

export default UpdateComponent;
