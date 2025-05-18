import {addUser, deleteUser} from '../models/usersModel.js'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '../middleware/jwt_helper.js';


export const signUpUser = async (req, res) => {
    try {
        // Request validation
        const { username, email, password, photo_url, longitude, latitude, address } = req.body;
        
        if (!username) return res.status(400).json({ message: 'Username is required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const saltRounds = 10;
        const hashed_password = await bcrypt.hash(password, saltRounds);
        const userData = { username, email, hashed_password, photo_url, longitude, latitude, address };
        const user = await addUser(userData)

        if (user && user.id){
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            });
            return res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    photo_url: user.photo_url,
                    address: user.address
                },
                accessToken
            });
        }

    } catch (error) {
        console.error('Error in signUpUser:', error);
        if (error.message === 'Email already exists') {
            return res.status(409).json({ message: error.message });
        }
        
        return res.status(500).json({ 
            message: 'Failed to create user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const result = await deleteUser(user_id);
        
        return res.status(200).json({
            success: result.success,
            message: result.message,
            deletedUser: result.user
        });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        
        return res.status(500).json({
            message: 'Failed to delete user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}