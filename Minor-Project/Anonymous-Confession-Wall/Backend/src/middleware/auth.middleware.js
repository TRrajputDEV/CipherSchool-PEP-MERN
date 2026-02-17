// Protect any route — user must have logged in via Google OAuth
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ message: "Please log in to continue." });
};

export { isAuthenticated };