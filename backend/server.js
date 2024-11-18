// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var wishlistRouter = require('./routes/wishlist');
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// app.use(cors({
//   origin: 'http://localhost:3000',  // allow requests from this origin
//   credentials: true,  // allow cookies and other credentials
// }));

app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

const connectDB = require('./db');
connectDB();

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Include user info in the token payload
    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).send({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Profile route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude the password field
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile route
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
