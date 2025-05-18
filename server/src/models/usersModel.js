import { db } from '../config/db.js'
import bcrypt from 'bcrypt'


export const addUser = async (userData) => {
    try {
        const { username, email, photo_url, hashed_password, longitude, latitude, address } = userData;

        // check if email already exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        // crepare data object for insertion
        const newUser = {
            username,
            email,
            photo_url,
            hashed_password,
            address
        };
        
        if (longitude && latitude) {
            newUser.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', [longitude, latitude]);
        }
        
        const [insertedUser] = await db('users')
            .insert(newUser)
            .returning(['id', 'username', 'email', 'photo_url', 'address']);
            
        return insertedUser;

    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

export const deleteUser = async (user_id) => {
    try {
        const result = await db.transaction(async trx => {
            // check if user exists
            const user = await trx('users')
                .where({ id: user_id })
                .first();
                
            if (!user) {
                throw new Error('User not found');
            }
            
            // PostgreSQL will handle cascading deletes if foreign key constraints 
            // are properly set up with ON DELETE CASCADE
            const deletedCount = await trx('users')
                .where({ id: user_id })
                .del();
                
            return {
                success: deletedCount > 0,
                message: deletedCount > 0 ? 'User successfully deleted' : 'No user deleted',
                deletedCount, 
                user
            };
        });
        
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export const authenticateUser = async (email, password) => {
    try {
        // Find the user with the given email
        const user = await db('users').where({ email }).first();
        
        if (!user) {
            return null;
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        
        if (!isPasswordValid) {
            return null;
        }
        
        // Return user data without sensitive information
        const { hashed_password, ...userData } = user;
        return userData;
        
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
}