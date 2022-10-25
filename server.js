import express from 'express';
import mongoRouter from './routes/mongoRoutes.js';
import sqlRouter from './routes/sqlRoutes.js';

const server = express();

const port = process.env.PORT || 5000;

server.get('/', (req, res) => res.status(200).json({hello: "Welcome to the Express and DBs recap!"}))
server.use('/sql', sqlRouter);
server.use('/mongo', mongoRouter);

server.listen(port, () => console.log(`Server connected to port ${port}`))