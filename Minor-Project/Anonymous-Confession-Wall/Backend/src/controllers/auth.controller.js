// GET /api/auth/me  — return logged-in user info from session
const getMe = (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(401).json({ user: null });
};

// POST /api/auth/logout  — destroy session
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logged out successfully." });
  });
};

export { getMe, logout };