import { db } from '../config/db.js'


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