import { db } from '../config/db.js'
import bcrypt from 'bcrypt'


export const addUser = async (userData) => {
    try {
        const { username, email, photo_url, password, longitude, latitude, address } = userData;

        // check if email already exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        const hashed_password = await bcrypt.hash(password, process.env.SALT);
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
            // check if user exists
            const user = await db('users')
                .where({ id: user_id })
                .first();
                
            if (!user) {
                throw new Error('User not found');
            }
            
            const deletedCount = await db('users')
                .where({ id: user_id })
                .del();
                
            return {
                success: deletedCount > 0,
                message: deletedCount > 0 ? 'User successfully deleted' : 'No user deleted',
                deletedCount, 
                user
            };
        
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

export const updateUserInDB = async (user_id, userData) => {
    try {
        const user = await db('users')
            .select('*')
            .where({id: user_id})
            .first()
        
            if (!user){
                return null
            }

        let userInfo = {}
        //client form passes only needed fields
        //fields can be rewritten with non-null values and not deletes

        if (userData.username) userInfo['username'] = userData.username
        if (userData.email) userInfo['email'] = userData.email;
        if (userData.photo_url) userInfo['photo_url'] = userData.photo_url;
        if (userData.address) userInfo['address'] = userData.address;
        if (userData.hashed_password) userInfo['hashed_password'] = userData.hashed_password;
        if (userData.longitude && userData.latitude) {
            userInfo.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', 
                [userData.longitude, userData.latitude]);
        }
        
        const [updatedUser] = await db('users')
            .where({ id: user_id })
            .update(userInfo)
            .returning(['id', 'username', 'email', 'photo_url', 'address', 'location']);
        
        return updatedUser;
        
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}