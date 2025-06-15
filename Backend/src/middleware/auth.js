import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token. Authorization denied." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // contains { id: ... }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default verifyToken;
