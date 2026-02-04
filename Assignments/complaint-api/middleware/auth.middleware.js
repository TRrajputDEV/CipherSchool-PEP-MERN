const authMiddleware = (req, res, next) => {
  console.log('Auth checked');
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization required'
    });
  }
  
  next();
};

export default authMiddleware;