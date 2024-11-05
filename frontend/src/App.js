import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BlogPostForm from './BlogPostForm';
import PostList from './PostList';
import Signin from './Signin';
import Signup from './Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const refreshPosts = () => {
    setRefresh(!refresh);
  };

  return (
    <Router>
      <div className="container">
        <h1 className="mt-5">Blog App</h1>
        <Routes>
          <Route path="/signin" element={<Signin setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/blogs"
            element={
              token ? (
                <>
                  <BlogPostForm refreshPosts={refreshPosts} />
                  <PostList refreshPosts={refreshPosts} />
                </>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/blogs" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;