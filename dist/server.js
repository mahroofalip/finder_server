"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const socket_1 = require("./sockets/socket");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dataInserts_1 = __importDefault(require("./dataInserts"));
const models_1 = require("./models"); // Adjust import path
const AutoRemoveVisitor_1 = require("./utils/AutoRemoveVisitor");
const express_1 = __importDefault(require("express"));
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app_1.default.use(express_1.default.json({ limit: '500mb', }));
app_1.default.use(express_1.default.urlencoded({ limit: '500mb', extended: true }));
// Set up global CORS (allow all origins)
app_1.default.use((0, cors_1.default)({
    origin: "*", // This allows requests from any origin
    credentials: true, // Allow credentials if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
// Create HTTP server
const server = http_1.default.createServer(app_1.default);
// Initialize WebSocket
(0, socket_1.initSocket)(server);
// Sync individual models
async function syncModels() {
    await (0, models_1.syncSidebarMenu)();
    await (0, models_1.syncUser)();
    await (0, models_1.syncRoom)();
    await (0, models_1.syncEducation)();
    await (0, models_1.syncEyeColor)();
    await (0, models_1.syncGender)();
    await (0, models_1.syncHairColor)();
    await (0, models_1.syncInterest)();
    await (0, models_1.syncMessage)();
    await (0, models_1.syncProfession)();
    await (0, models_1.syncUsersPosts)();
    await (0, models_1.syncVisitors)();
    await (0, models_1.syncBlockedUsers)();
    await (0, models_1.syncIgnoredUser)();
    await (0, models_1.syncLike)();
}
// Sync models and start server
syncModels()
    .then(() => {
    console.log('Models synchronized successfully.');
    return (0, dataInserts_1.default)();
})
    .then(() => {
    console.log('Initial data inserted successfully.');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        AutoRemoveVisitor_1.removeOldVisitorRecordsJob.start();
        console.log('Crown Job started Successfully');
    });
})
    .catch((err) => {
    console.error('Unable to sync models, insert data, or start server:', err);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed.');
        database_1.default.close().then(() => {
            console.log('Database connection closed.');
            process.exit(0);
        });
    });
});
