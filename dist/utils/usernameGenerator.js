"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueUsername = void 0;
const uuid_1 = require("uuid");
const generateUniqueUsername = async () => {
    const uniqueId = (0, uuid_1.v4)().replace(/-/g, '');
    return uniqueId.toUpperCase();
};
exports.generateUniqueUsername = generateUniqueUsername;
