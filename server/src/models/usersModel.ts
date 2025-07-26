import { db } from '../config/db';
import bcrypt from 'bcrypt';
import { User, UserSignUp } from '../types/index';

interface UserInDB extends User {
    id: number;
    hashed_password?: string;
}

export const addUser = async (userData: UserSignUp): Promise<User> => {
    try {
        const { username, email, photo_url, password, location, city, address, neighborhood_id } = userData;

        // check if email already exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        const saltRounds = parseInt(process.env.SALT || '10');
        const hashed_password = await bcrypt.hash(password, saltRounds);
        
        const saveUserData: any = {
            username, 
            email, 
            photo_url,
            hashed_password,
            city, 
            address,
            neighborhood_id
        };
        
        if (location) {
            saveUserData.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', 
                [location.lng, location.lat]);
        }
        
        const [insertedUser] = await db('users')
            .insert(saveUserData)
            .returning([
                'id',
                'username',
                'email', 
                'photo_url',
                'address', 
                'city',
                db.raw('ST_AsGeoJSON(location)::json as location'),
                'neighborhood_id'
            ]);
            
        return insertedUser;

    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const deleteUser = async (userId: number): Promise<UserInDB> => {
    return await db.transaction(async (trx) => {
        const user = await trx('users').where({ id: userId }).first();
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Delete user's comments
        await trx('comments').where({ user_id: userId }).del(); 
        
        // Delete user's followers relationships
        await trx('followers').where({ user_id: userId }).del();
        
        // Delete user's reports from all tables
        const reportTables = ['give_aways', 'issue_reports', 'help_requests', 'offer_help'];
        for (const table of reportTables) {
            const column = table === 'give_aways' ? 'user_id' : 'user_id';
            await trx(table).where({ [column]: userId }).del();
        }
        
        // Finally delete the user
        const [deletedUser] = await trx('users')
            .where({ id: userId })
            .del()
            .returning('*');
            
        return deletedUser;
    });
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    try {
        // Find the user with the given email
        const user = await db('users')
            .select([
                'id',
                'username', 
                'email', 
                'photo_url',
                'address',
                'hashed_password', 
                'city',
                db.raw('ST_AsGeoJSON(location)::json as location'),
                'neighborhood_id'
            ])
            .where({ email })
            .first();
        
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
};

export const updateUserInDB = async (user_id: number, userData: Partial<User>): Promise<User | null> => {
    try {
        const user = await db('users')
            .select('*')
            .where({ id: user_id })
            .first();
        
        if (!user) {
            return null;
        }

        const userInfo: any = {};
        
        // Client form passes only needed fields
        // Fields can be rewritten with non-null values and not deletes
        if (userData.username) userInfo['username'] = userData.username;
        if (userData.email) userInfo['email'] = userData.email;
        if (userData.photo_url) userInfo['photo_url'] = userData.photo_url;
        if (userData.address) userInfo['address'] = userData.address;
        if (userData.location) {
            userInfo.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', 
                [userData.location.lng, userData.location.lat]);
        }
        if (userData.city) userInfo['city'] = userData.city;
        if (userData.neighborhood_id) userInfo['neighborhood_id'] = userData.neighborhood_id;
        
        const [updatedUser] = await db('users')
            .where({ id: user_id })
            .update(userInfo)
            .returning([
                'id', 
                'username', 
                'email', 
                'photo_url', 
                'address', 
                db.raw('ST_AsGeoJSON(location)::json as location'),
                'neighborhood_id'
            ]);
        
        return updatedUser;
        
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
