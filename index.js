import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router.js';
import 'dotenv/config';
import { notFoundHandler, errorHandler } from './error.js';
import logger from './logger.js';

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger());

app.use('/', router);

app.use((req, res) => {
  res.json(req.debug);
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Alchemy mock listening on port ${port}`);
});
