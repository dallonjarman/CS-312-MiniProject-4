// Import the required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8000;

// The middleware to parse the request body
app.use(cors());
app.use(bodyParser.json());

// The database connection
const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'blog_app',
  password: 'password',
  port: 5432,
});

// The secret key for JWT
const secret = 'secret';

// Signup will create a new user
app.post('/signup', async (req, res) => {
  // Extract the username and password from the request body
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Signin will authenticate the user
app.post('/signin', async (req, res) => {

  // Extract the username and password from the request body
  const { username, password } = req.body;
  // Find the user in the database
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    // Compare the password
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    // Generate the JWT token
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// The authenticate middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// The blog routes
app.get('/blogs', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single blog post
app.post('/blogs', authenticate, async (req, res) => {
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, body, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, body, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a blog post
app.put('/blogs/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE blogs SET title = $1, body = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, body, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog post
app.delete('/blogs/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});