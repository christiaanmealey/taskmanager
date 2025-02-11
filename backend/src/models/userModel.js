import User from '../schemas/userSchema.js';
/**
 * Fetches all users from the database
 * @returns {Promise<Array>} - List of all users
 */
export async function findAllUsers() {
    try {        
        const result = await User.find({});
        return result;
    } catch (error) {
        console.error(`there was an error fetching users`, error);
    }
}

/**
 * Fetches a user from the database from provided criteria
 * @param {object} query - A mongo-formatted query ex. {email: 'name[@]example.com'} or {_id: <mongo_id>}
 * @returns {Promise<Array>} - A user object from the database
 */
export async function findUserBy(query) {
    try {        
        const result = await User.find(query);
        return result;
    } catch (error) {
        console.error(`there was an error fecting user with query: ${query}`, error);
        throw error;
    }
}

/**
 * creates a user in the database
 * @param {object} user - an object to create the user with
 * @returns {object} - the result of the insert operation
 */
export async function createUser(user) {
    try {
        const result = await User.create(user);
        return result;
    } catch (error) {
        console.error(`there was an error creating user with ${user.email}`, error);
        throw error;
    }
}

/**
 * Updates a user in the database
 * @param {object} query - A mongo query object ex {email: name[@]example.com} 
 * @param {object} update - an object containing the fields to update in the user record 
 * @returns {object} - the result of the update operation
 */
export async function updateUser(query, update) {
    try {
        const result = await User.updateOne(query, update);
        return result;
    } catch (error) {
        console.error(`there was an error updating user with query: ${query}`, error);
        throw error;
    }
}

/**
 * 
 * @param {object} query - A mongo query object ex {email: name[@]example.com}
 * @returns {object} - the result of the delete operation
 */
export async function deleteUser(query) {
    try {
        const result = User.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`there was an error deleting user with query: ${query}`, error);
    }
}