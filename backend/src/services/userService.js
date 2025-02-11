import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as userModel from "../models/userModel.js";

export async function getUsers() {
    try {
        const result = await userModel.findAllUsers();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const oid = new ObjectId(id);
        const query = {_id: oid};
        const result = await userModel.findUserBy(query);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getUserByEmail(email) {
    try {
        const query = {email};
        const result = await userModel.findUserBy(query);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function matchPassword(enteredPassword, userPassword) {
    if(!enteredPassword || !userPassword) return false;
    return bcrypt.compare(enteredPassword, userPassword);
}

export async function userExists(user) {
    const {username, email} = user;
    const userByEmail = await getUserByEmail(email);
    const userByUsername = await userModel.findUserBy({username});
    if(userByEmail.length > 0 || userByUsername.length > 0) {
        return true;
    }
    return false;
}

export async function createUser(user) {
    const {email, password} = user;

    if(!isValidEmail(email)) {
        throw new Error('error creating user: invalid email');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    try {
        const result = await userModel.createUser(user);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(id, user) {
    try {
        const oid = new ObjectId(id);
        const query = {_id: oid};
        const update = {$set: user};
        const result = await userModel.updateUser(query, update);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const oid = new ObjectId(id);
        const query = {_id: oid};
        const result = await userModel.deleteUser(query);
    } catch (error) {
        throw error;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}