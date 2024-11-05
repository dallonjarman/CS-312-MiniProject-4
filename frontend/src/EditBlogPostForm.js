import React, { useState } from 'react';
import axios from 'axios';

const EditBlogPostForm = ({ blog, refreshPosts, setEditing }) => {
  const [title, setTitle] = useState(blog.title);
  const [body, setBody] = useState(blog.body);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/blogs/${blog.id}`, { title, body }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
      setEditing(false);
    } catch (error) {
      console.error('There was an error updating the blog post!', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            className="form-control"
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter body"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Update Post</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={() => setEditing(false)}>Cancel</button>
      </form>
    </div>
  );
};

export default EditBlogPostForm;