import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditBlogPostForm from './EditBlogPostForm';

const PostList = ({ refreshPosts }) => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/blogs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('There was an error fetching the blog posts!', error);
      }
    };

    fetchPosts();
  }, [refreshPosts]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (error) {
      console.error('There was an error deleting the blog post!', error);
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setEditing(true);
  };

  return (
    <div className="container mt-5">
      <h2>Blog Posts</h2>
      {editing ? (
        <EditBlogPostForm blog={currentBlog} refreshPosts={refreshPosts} setEditing={setEditing} />
      ) : (
        <div className="list-group">
          {posts.map((post) => (
            <div key={post.id} className="list-group-item">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <button className="btn btn-warning mr-2" onClick={() => handleEdit(post)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;