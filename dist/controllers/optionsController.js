"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEyeColor = exports.getHairColor = exports.getinterests = exports.getProfession = exports.getEducation = exports.getGenders = void 0;
const EyeColor_1 = __importDefault(require("../models/EyeColor"));
const Gender_1 = __importDefault(require("../models/Gender"));
const Education_1 = __importDefault(require("../models/Education"));
const Profession_1 = __importDefault(require("../models/Profession"));
const HairColor_1 = __importDefault(require("../models/HairColor"));
const Interest_1 = __importDefault(require("../models/Interest"));
const getGenders = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const genders = await Gender_1.default.findAll();
        res.status(200).send(genders);
    }
    catch (error) {
        next(error);
    }
};
exports.getGenders = getGenders;
const getEducation = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const education = await Education_1.default.findAll();
        res.status(200).send(education);
    }
    catch (error) {
        next(error);
    }
};
exports.getEducation = getEducation;
const getProfession = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const profession = await Profession_1.default.findAll();
        res.status(200).send(profession);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfession = getProfession;
const getinterests = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const interests = await Interest_1.default.findAll();
        res.status(200).send(interests);
    }
    catch (error) {
        next(error);
    }
};
exports.getinterests = getinterests;
const getHairColor = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const hairColor = await HairColor_1.default.findAll();
        res.status(200).send(hairColor);
    }
    catch (error) {
        next(error);
    }
};
exports.getHairColor = getHairColor;
const getEyeColor = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const eyeColor = await EyeColor_1.default.findAll();
        res.status(200).send(eyeColor);
    }
    catch (error) {
        next(error);
    }
};
exports.getEyeColor = getEyeColor;
