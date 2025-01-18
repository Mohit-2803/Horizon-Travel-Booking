// adminMiddleware.js
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // Proceed if the user is an admin
  }

  return res.status(403).json({ message: "Access denied, admin only" });
};
