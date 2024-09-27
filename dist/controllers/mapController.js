"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaces = void 0;
// Use require for CommonJS-compatible version of node-fetch
const fetch = require('node-fetch');
const getPlaces = async (req, res) => {
    try {
        const { input } = req.query;
        const response = await fetch(`${process.env.GOOGLE_API}?input=${input}&key=${process.env.GOOGLE_API_KEY}`);
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch places' });
    }
};
exports.getPlaces = getPlaces;
