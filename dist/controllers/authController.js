"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const jwt_1 = require("../utils/jwt");
const usernameGenerator_1 = require("../utils/usernameGenerator");
const registerUser = async (req, res, next) => {
    try {
        const { email, password, phone, firstName, lastName } = req.body;
        const userExists = await User_1.default.findOne({ where: { email } });
        if (userExists) {
            res.status(401).json({
                status: 'exist',
                message: "User already exists",
                user: null,
            });
            return;
        }
        else {
            // Generate a unique username
            const uniqueUsername = await (0, usernameGenerator_1.generateUniqueUsername)();
            // Create a new user
            const newUser = await User_1.default.create({
                email,
                password: password, // Ideally, hash the password before storing it
                phone,
                firstName,
                lastName,
                isOnline: false,
                isProfileCompleted: false,
                profileImage: null,
                userName: uniqueUsername, // Use the generated unique username
                birthDate: null,
                height: null,
                weight: null,
                maritalStatus: null,
            });
            const token = (0, jwt_1.generateToken)(newUser.id);
            res.status(200).json({
                status: 'success',
                token,
                user: newUser,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
// Login function
const loginUser = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;
        if (!email || !password) {
            throw new AppError_1.default('All fields are required', 400);
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user || user.password !== password) {
            throw new AppError_1.default('Invalid email or password', 401);
        }
        const tokenExpiry = rememberMe ? '7d' : '1d'; // Extend the token to 7 days if "Remember me" is checked
        const token = (0, jwt_1.generateToken)(user.id, tokenExpiry);
        res.status(200).json({
            status: 'success',
            token,
            message: "User Login completed Successfully",
            user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
