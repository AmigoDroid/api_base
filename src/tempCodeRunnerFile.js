import express from 'express';
import { router } from './routes/index.js';
import http from 'http';
import { setupSocket } from './webSocket/index.js';
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
app.use(router);
setupSocket(server);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
