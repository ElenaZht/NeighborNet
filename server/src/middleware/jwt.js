import { validateToken } from '../helpers/jwt_utils';


export const verifyAccessToken = (req, res, next) => {
  console.log("jwt verifyAccessToken req.", req)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = validateToken(token, ACCESS_TOKEN_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    next();
};

export const verifyRefreshToken = (req, res, next) => {
    const token = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!token) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }
    
    const decoded = validateToken(token, REFRESH_TOKEN_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    req.user = decoded;
    next();
};