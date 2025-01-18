import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to req.user
    next();
  } catch (error) {
    console.error("Token verification error: ", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
