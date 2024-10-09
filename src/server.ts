import http from 'http';
import app from './app';
import sequelize from './config/database';
import { initSocket } from './sockets/socket';
import dotenv from 'dotenv';
import cors from 'cors';
import insertData from './dataInserts';
import { 
  syncEducation, syncEyeColor, syncGender, syncHairColor, 
  syncInterest, syncMessage, syncProfession, syncRoom, 
  syncUser, syncUsersPosts, syncVisitors, syncBlockedUsers, 
  syncIgnoredUser, syncLike, syncSidebarMenu 
} from './models'; // Adjust import path
import { removeOldVisitorRecordsJob } from './utils/AutoRemoveVisitor';
import express from 'express';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '500mb',  }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Set up global CORS (allow all origins)
app.use(cors({
  origin: "https://www.kizzora.fun", // Temporarily allow all origins
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);

// Sync individual models
async function syncModels() {
  await syncSidebarMenu();
  await syncUser();
  await syncRoom();
  await syncEducation();
  await syncEyeColor();
  await syncGender();
  await syncHairColor();
  await syncInterest();
  await syncMessage();
  await syncProfession();
  await syncUsersPosts();
  await syncVisitors();
  await syncBlockedUsers();
  await syncIgnoredUser();
  await syncLike();
}

// Sync models and start server
syncModels()
  .then(() => {
    console.log('Models synchronized successfully.');
    return insertData();
  })
  .then(() => {
    console.log('Initial data inserted successfully.');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      removeOldVisitorRecordsJob.start();
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
    sequelize.close().then(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});
