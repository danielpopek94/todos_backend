require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
