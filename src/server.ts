// // src/server.ts
// import app from './app';
// import { createServer } from 'http';
// import { initSocket } from './sockets/socket';

// const PORT = process.env.PORT || 5000;

// // Create an HTTP server
// const server = createServer(app);

// // Initialize Socket.IO
// initSocket(server);

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import http from 'http';
import app from './app';
import sequelize from './config/database';
import { initSocket } from './sockets/socket';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

sequelize.sync().then(() => {
  console.log('Database connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

