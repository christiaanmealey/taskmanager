import asyncHandler from "express-async-handler";
import * as userService from "../services/userService.js";
// import validators from "../validators/index.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = asyncHandler(async(req, res) => {
    const {username, email, password, role = 'user'} = req.body;
    // const validate = validators.userSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error creating user', validate.errors);
    //     return res.status(400).json({errors: validate.errors});
    // }

    const exists = await userService.userExists({username, email});
    if(exists) {
        return res.status(400).json({error: "username or email exists"});
    }

    const user = await userService.createUser({username, email, password, role});
    const userId = user._id.toString();
    if(user) {
        res.json({
            username,
            email,
            role,
            token: generateToken(userId)
        });
    } else { 
        res.status(400);
        throw new Error('Invalid User Data');
    }
});

export const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const user = await userService.getUserByEmail(email);
    const userId = user._id;
    if(user && userService.matchPassword(password, user.password)) {
        res.status(200).json({
            email,
            role: user.role,
            token: generateToken(userId)
        });
    } else {
        res.status(401).json('not authorized');
        throw new Error('not authorized');
    }
});

export const fetchUsers = asyncHandler(async(req, res) => {
    try {
        const result = await userService.getUsers();
        res.status(200).json(result);        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'there was an error getting users'});
    }
});

export const fetchUserById = asyncHandler(async(req, res) => {
    try {
        const result = await userService.getUserById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('there was an error fetching user', error);
        res.status(500).json({error: error.message});
    }
});

export const fetchUserByEmail = asyncHandler(async(req, res) => {
    try {
        const result = await userService.getUserByEmail(req.query.email);
        res.status(200).json(result);
    } catch (error) {
        console.error('there was an error fecting user', error);
        res.status(500).json({error: error.message});
    }
});

export const updateUser = asyncHandler(async(req, res) => {
    // const validate = validators.userSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error updating user', validate.errors);
    //     return res.status(400).json({errors: validate.errors});
    // }
    try {
        const result = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('there was an error updating user', error);
        res.status(500).json({error: error.message});
    }
});

export const deleteUser = asyncHandler(async(req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('there was an error deleting user', error);
        res.status(500).json({error: error.message});
    }
});