import React, { useState } from 'react';
import axios from 'axios';

const BlogPostForm = ({ refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/blogs', { title, body }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setBody('');
      refreshPosts();
    } catch (error) {
      console.error('There was an error creating the blog post!', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Blog Post</h2>
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
        <button type="submit" className="btn btn-primary mt-3">Create Post</button>
      </form>
    </div>
  );
};

export default BlogPostForm;