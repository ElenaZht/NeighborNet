import { Request, Response } from 'express';
import {
    addUser, 
    deleteUser, 
    authenticateUser,
    updateUserInDB
} from '../models/usersModel.js';
import { 
    validateToken,    
    generateAccessToken, 
    generateRefreshToken, 
} from '../helpers/jwt_utils.js';
import { getNeighborhoodByCoordinates } from '../models/neighborhoodModel.js';
import { UserSignUp, AuthRequest } from '../types/index.js';

export const signUpUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Request validation
        const { 
            username, 
            email, 
            password, 
            photo_url, 
            location,
            city, 
            address 
        }: UserSignUp = req.body;
        
        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        if (!address) {
            res.status(400).json({ message: 'Address is required' });
            return;
        }
        if (!city) {
            res.status(400).json({ message: 'City is required' });
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        
        const userData: UserSignUp = { username, email, password, photo_url, location, city, address };

        if (location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            if (neighborhood) {
                userData.neighborhood_id = neighborhood.id;
            }
        }
        
        const user = await addUser(userData);

        if (user && user.id) {
            console.info("User created: ", user);
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: parseInt(process.env.REFRESH_DEFAULT_MAX_AGE || '604800000'), // 7 days
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            });
            res.status(201).json({
                message: 'User created successfully',
                user: user,
                accessToken
            });
            return;
        } else {
            res.status(500).json({ 
                message: 'Failed to create user - user creation returned invalid data'
            });
            return;
        }

    } catch (error) {
        console.error('Error in signUpUser:', error);
        if (error instanceof Error && error.message === 'Email already exists') {
            res.status(409).json({ message: error.message });
            return;
        }
        
        res.status(500).json({ 
            message: 'Failed to create user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user_id = req.params.user_id;
        
        if (!user_id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        
        const result = await deleteUser(parseInt(user_id));
        console.info("User deleted: ", result);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            deletedUser: result
        });

    } catch (error) {
        console.error('Error in deleteAccount:', error);
        
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({ message: error.message });
            return;
        }
        
        res.status(500).json({
            message: 'Failed to delete user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        
        const user = await authenticateUser(email, password);
        
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        
        console.info("User logged in: ", user);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: parseInt(process.env.REFRESH_DEFAULT_MAX_AGE || '604800000'), // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                photo_url: user.photo_url,
                address: user.address,
                city: user.city,
                location: user.location,
                neighborhood_id: user.neighborhood_id
            },
            accessToken
        });
        
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({
            message: 'Login failed',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        console.info("User logout: ", (req as AuthRequest)?.user);
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error in logoutUser:', error);
        res.status(500).json({
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const refreshUserToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            res.status(401).json({ message: "Refresh token is missing" });
            return;
        }

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            res.status(500).json({ message: "Server configuration error" });
            return;
        }

        const decoded = validateToken(oldRefreshToken, refreshTokenSecret);
        if (!decoded) {
            res.status(401).json({ message: "Refresh token not valid" });
            return;
        }
        
        console.info("User refreshed tokens: ", decoded);
        const newAccessToken = generateAccessToken(decoded);

        res.status(200).json({ 
            message: 'Access token refreshed successfully', 
            accessToken: newAccessToken,
            user_id: decoded.user_id
        });        
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};

export const editUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user_id = req.params.user_id;
        if (!user_id) {
            res.status(400).json({ message: "User id is missing" });
            return;
        }

        const userData = req.body;
        if (!userData) {
            res.status(400).json({ message: "User data is missing" });
            return;
        }

        if (userData.location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(userData.location.lat, userData.location.lng);
            if (neighborhood) {
                userData.neighborhood_id = neighborhood.id;
            }
        }
        
        const editedUser = await updateUserInDB(parseInt(user_id), userData);
        if (editedUser) {
            console.info("User edited: ", editedUser);
            res.status(200).json({ message: 'User info edited successfully', editedUser });
            return;
        }
        
    } catch (error) {
        console.error('Error in editUser:', error);
        res.status(500).json({
            message: 'Failed to edit user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
