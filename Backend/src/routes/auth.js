// // routes/auth.js
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const router = express.Router();

// // Middleware to verify JWT token from cookies
// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.token;
  
//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

// // ✅ REGISTER Route
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "Please enter all fields" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const newUser = new User({ name, email, password: hash });
//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
//     // Set cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     res.status(201).json({ 
//       _id: newUser._id, 
//       name: newUser.name, 
//       email: newUser.email 
//     });
//   } catch (err) {
//     console.error("Registration Error:", err.message);
//     res.status(500).json({ error: err.message || "Server Error" });
//   }
// });

// // ✅ LOGIN Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({ msg: "Please enter all fields" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User does not exist" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
//     // Set cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     res.status(200).json({ 
//       _id: user._id, 
//       name: user.name, 
//       email: user.email 
//     });
//   } catch (err) {
//     console.error("Login Error:", err.message);
//     res.status(500).json({ error: err.message || "Server Error" });
//   }
// });

// // ✅ AUTH STATUS Route (NEW - this was missing)
// router.get("/status", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }
    
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email
//     });
//   } catch (error) {
//     console.error('Auth status error:', error);
//     res.status(500).json({ message: 'Server error during authentication check' });
//   }
// });


// // ✅ LOGOUT Route (NEW - this was missing)
// router.post("/logout", (req, res) => {
//   res.clearCookie('token');
//   res.json({ message: 'Logged out successfully' });
// });

// export default router;
import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;