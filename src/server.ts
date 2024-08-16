import http from 'http';
import app from './app';
import sequelize from './config/database';
import { initSocket } from './sockets/socket';
import dotenv from 'dotenv';
import cors from 'cors'; // Make sure to import cors
import insertData from './dataInserts';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);
// insertData()

// Set up CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));


// Sync database and start server
sequelize.sync({ alter: true }).then(() => { // Use `alter` for non-destructive sync
  console.log('Database synchronized successfully.');
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
