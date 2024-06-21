

import http from 'http';
import app from './app';
import sequelize from './config/database';
import { initSocket } from './sockets/socket';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

initSocket(server);

sequelize.sync().then(() => {
  console.log('Database connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

