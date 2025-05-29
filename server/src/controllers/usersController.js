import {
    addUser, 
    deleteUser, 
    authenticateUser,
    updateUserInDB
} from '../models/usersModel.js'
import { 
    validateToken,    
    generateAccessToken, 
    generateRefreshToken, 
} from '../helpers/jwt_utils.js';
import { getNeighborhoodByCoordinates } from '../models/neighborhoodModel.js';


export const signUpUser = async (req, res) => {
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
        } = req.body;
        
        if (!username) return res.status(400).json({ message: 'Username is required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        if (!address) return res.status(400).json({ message: 'Address is required' });
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const userData = { username, email, password, photo_url, location, city, address };

        if (location){
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            if (neighborhood){
                userData.neighborhood_id = neighborhood.id
            }
        }
        const user = await addUser(userData)

        if (user && user.id){
            console.info("User created: ", user)
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: process.env.REFRESH_DEFAULT_MAX_AGE,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            });
            return res.status(201).json({
                message: 'User created successfully',
                user: user,
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
        console.info("User deleted: ", result)

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        
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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await authenticateUser(email, password);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        console.info("User logged in: ", user)
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: process.env.REFRESH_DEFAULT_MAX_AGE,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                photo_url: user.photo_url,
                address: user.address
            },
            accessToken
        });
        
    } catch (error) {
        console.error('Error in loginUser:', error);
        return res.status(500).json({
            message: 'Login failed',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        console.info("User logout: ", req?.user)
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error in logoutUser:', error);
        return res.status(500).json({
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const refreshUserToken = async (req, res) => {
    try {

        const oldRefreshToken = req.cookies.refreshToken
        if (!oldRefreshToken){
            res.status(401).json({message: "Refresh token is missing"})
            return
        }

        const decoded = validateToken(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        if(!decoded){
            res.status(401).json({message: "Refresh token not valid"})
            return
        }
        console.info("User refreshed tokens: ", decoded)
        const newAccessToken = generateAccessToken(decoded)

        return res.status(200).json({ 
            message: 'Access token refreshed successfully', 
            accessToken: newAccessToken,
            user_id: decoded.id
        });        
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token.' })
    }
}

export const editUser = async (req, res) => {
    try {
        const user_id = req.params.user_id
        if (!user_id){
            res.status(400).json({message: "User id is missing"})
            return
        }

        const userData = req.body
        if (!userData){
            res.status(400).json({message: "User data is missing"})
            return
        }

        if (userData.location){
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            if (neighborhood){
                userData.neighborhood_id = neighborhood.id
            }
        }
        const editedUser = await updateUserInDB(user_id, userData)
        if (editUser){
            console.info("User edited: ", editUser)
            res.status(200).json({message: 'User info edited successfully', editedUser})
            return
        }
        
    } catch (error) {
        console.error('Error in editUser:', error);
        return res.status(500).json({
            message: 'Failed to edit user',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}