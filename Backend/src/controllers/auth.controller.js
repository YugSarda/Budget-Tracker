// // import User from "../models/User.js";
// // import jwt from "jsonwebtoken";
// // import asyncHandler from "../utils/asyncHandler.js";
// // import ApiError from "../utils/ApiError.js";
// // import ApiResponse from "../utils/ApiResponse.js";

// // // Register User
// // export const register = asyncHandler(async (req, res) => {
// //     const { username, email, password, role } = req.body;

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) throw new ApiError(400, "User already exists!");

// //     const user = new User({ username, email, password, role });
// //     await user.save();

// //     res.status(201).json(new ApiResponse(201, "User registered successfully", user));
// // });

// // // Login User
// // export const login = asyncHandler(async (req, res) => {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user || user.password !== password) throw new ApiError(401, "Invalid credentials");


// //     const token = jwt.sign(
// //         { id: user._id, role: user.role },
// //         process.env.ACCESS_TOKEN_SECRET,
// //         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
// //     );

// //     // Return token and user role
// //     res.json(new ApiResponse(200, "Login successful", { token, role: user.role }));
// // });


// // import User from "../models/User.js";
// // import jwt from "jsonwebtoken";
// // import bcrypt from "bcrypt";
// // import asyncHandler from "../utils/asyncHandler.js";
// // import ApiError from "../utils/ApiError.js";
// // import ApiResponse from "../utils/ApiResponse.js";

// // // Register User
// // export const register = asyncHandler(async (req, res) => {
// //     const { username, email, password, role } = req.body;

// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //         throw new ApiError(400, "User with this email already exists!");
// //     }

// //     // Hash password before saving
// //     const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

// //     // Create new user
// //     const user = new User({
// //         username,
// //         email,
// //         password: hashedPassword,
// //         role,
// //     });

// //     // Save user to database
// //     await user.save();

// //     // Return success response (excluding password)
// //     const userResponse = user.toObject();
// //     delete userResponse.password;

// //     res.status(201).json(
// //         new ApiResponse(201, "User registered successfully", userResponse)
// //     );
// // });
// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: "User with this email already exists!" });
// //     }

// //     // Continue registration logic...
// //   } catch (err) {
// //     console.error("Registration error:", err.message);
// //     res.status(500).json({ message: "Server error. Please try again." });
// //   }
// // };

// // // Login User
// // export const login = asyncHandler(async (req, res) => {
// //     const { email, password } = req.body;

// //     // Find user by email
// //     const user = await User.findOne({ email }).select("+password"); // Explicitly include password
// //     if (!user) {
// //         throw new ApiError(401, "Invalid email or password");
// //     }

// //     // Compare passwords securely
// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //         throw new ApiError(401, "Invalid email or password");
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //         { id: user._id, role: user.role },
// //         process.env.ACCESS_TOKEN_SECRET,
// //         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
// //     );

// //     // Return token and user role (excluding password)
// //     const userResponse = user.toObject();
// //     delete userResponse.password;

// //     res.status(200).json(
// //         new ApiResponse(200, "Login successful", {
// //             token,
// //             role: user.role,
// //             user: userResponse,
// //         })
// //     );
// // });

// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import asyncHandler from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";

// // Register User
// export const register = asyncHandler(async (req, res) => {
//   const { username, email, password, role } = req.body;

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new ApiError(400, "User with this email already exists!");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = new User({ username, email, password: hashedPassword, role });
//   await user.save();

//   const userResponse = user.toObject();
//   delete userResponse.password;

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   res.status(201).json(
//     new ApiResponse(201, "User registered successfully", {
//       token,
//       user: userResponse,
//       role: user.role,
//     })
//   );
// });

// // Login User
// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     throw new ApiError(401, "Invalid email or password");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid email or password");
//   }

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   const userResponse = user.toObject();
//   delete userResponse.password;

//   res.status(200).json(
//     new ApiResponse(200, "Login successful", {
//       token,
//       role: user.role,
//       user: userResponse,
//     })
//   );
// });
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
