import 'dotenv/config';
import express from 'express';
import mongoRouter from './routes/mongoRoutes.js';
import sqlRouter from './routes/sqlRoutes.js';
import mongoConnection from './DB/mongoConnection.js';
// As mongoose does not have a inbuilt sanitization tool like pg, we make use of another library, "express-mongo-sanitize"
// to sanitize inputs and escape characters that have a special meaning for MongoDB!
import sanitize from "express-mongo-sanitize";

mongoConnection();

const server = express();

const port = process.env.PORT || 5000;

server.use(express.json());
server.use(express.urlencoded({extended: true}));


server.get('/', (req, res) => res.json({hello: "Welcome to the Express and DBs recap!"}))
server.use('/sql', sqlRouter);
// And we make sure that the sanitization middleware from express-mongo-sanitize is used for all MongoDB routes in our app!
server.use('/mongo', sanitize({ allowDots: true, replaceWith: "_" }), mongoRouter);

server.listen(port, () => console.log(`Server connected to port ${port}`))