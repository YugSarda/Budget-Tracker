// // import jwt from "jsonwebtoken";

// // const verifyToken = (req, res, next) => {
// //   const token = req.header("Authorization")?.replace("Bearer ", "");
// //   if (!token) return res.status(401).json({ msg: "No token. Authorization denied." });

// //   try {
// //     const verified = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = verified; // contains { id: ... }
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ msg: "Token is not valid" });
// //   }
// // };

// // export default verifyToken;
// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Token invalid' });
//   }
// };
// export const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) return res.status(401).json({ message: "Access denied" });

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: "Invalid token" });
//     }
// };


import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Token invalid or expired" });
  }
};

export default authMiddleware;
