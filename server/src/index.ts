import express from 'express';
import { Server } from 'http';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import controller from './controller';

const app: express.Application = express();
const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const httpServer = new Server(app);

controller(httpServer);

app.use(function (_, _2, next) {
  next(createError(404));
});

httpServer.listen(port, function () {
  console.log('listening on *:' + port);
});
