import { db } from '../config/db.js'
import bcrypt from 'bcrypt'


export const addUser = async (userData) => {
    try {
        const { username, email, photo_url, password, location, city, address, neighborhood_id } = userData;

        // check if email already exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        const saltRounds = parseInt(process.env.SALT)
        const hashed_password = await bcrypt.hash(password, saltRounds);
        userData.hashed_password = hashed_password
        
        const saveUserData = {
            username, 
            email, 
            photo_url,
            hashed_password,
            location, 
            city, 
            address,
            neighborhood_id
        }
        
        if (location) {
            saveUserData.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', [location.lat, location.lng]);
        }
        
        const [insertedUser] = await db('users')
            .insert(saveUserData)
            .returning(['id',
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
}

export const deleteUser = async (userId) => {
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
      await trx(table).where({ userid: userId }).del();
    }
    
    // Finally delete the user
    const [deletedUser] = await trx('users')
      .where({ id: userId })
      .del()
      .returning('*');
      
    return deletedUser;
  });
};

export const authenticateUser = async (email, password) => {
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
        if (userData.location) {
            userInfo.location = db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', 
                [userData.location.lat, userData.location.lng]);
        }
        if (userData.city) userInfo['city'] = userData.city
        if (userData.neighborhood_id) userInfo['neighborhood_id'] = userData.neighborhood_id
        
        const [updatedUser] = await db('users')
            .where({ id: user_id })
            .update(userInfo)
            .returning(['id', 'username', 'email', 'photo_url', 'address', db.raw('ST_AsGeoJSON(location)::json as location')]);
        
        return updatedUser;
        
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}