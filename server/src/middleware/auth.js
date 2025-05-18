import { validateToken } from './jwt_helper.js';


export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization header is missing or malformed.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = validateToken(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired access token.' });
        }
        
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired access token.' });
    }
};