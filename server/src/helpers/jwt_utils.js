import jwt from 'jsonwebtoken';


export const generateAccessToken = (user) => {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_DEFAULT_MAX_AGE });
};

export const generateRefreshToken = (user) => {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_DEFAULT_MAX_AGE });
};

export const validateToken = (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
};