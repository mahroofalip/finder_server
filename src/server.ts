import http from 'http';
import app from './app';
import sequelize from './config/database';
import { initSocket } from './sockets/socket';
import dotenv from 'dotenv';
import cors from 'cors';
// import insertData from './dataInserts';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Set up CORS
app.use(cors({
  origin: CORS_ORIGIN, 
  credentials: true,
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);

// Sync database and start server
sequelize.sync({ alter: true }) // Use `alter` for non-destructive sync
  .then(() => {
    console.log('Database synchronized successfully.');
    
    // Insert initial data
    // return insertData();
  })
  .then(() => {
    console.log('Initial data inserted successfully.');
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database or insert data:', err);
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
