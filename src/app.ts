import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };

import env from './env.js';
import IndexRouter from './routers/indexRouter.js';
import UserRouter from './routers/userRouter.js';
import payRouter from './routers/payRouter.js'
import TestRouter from './routers/testRouter.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();
const httpport: number = env.HTTPPORT;
const httpsport: number = env.HTTPSPORT;

app.set('view engine', 'pug');
app.set('views', './views');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:443',
    'http://localhost:5173',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', IndexRouter);
app.use('/users', UserRouter);
app.use('/pay',payRouter)
app.use('/tests', TestRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/axios', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'axiosTest.html'));
});

const privateKey = fs.readFileSync('src/key.pem');
const certificate = fs.readFileSync('src/cert.crt');

const httpsServer = https.createServer({
  key: privateKey,
  cert: certificate
}, app);
httpsServer.listen(httpsport, () => {
  console.log(`Example app listening at https://localhost:${httpsport}`);
  console.log(env.NODE_ENV);
  console.log(process.env.NODE_EXTRA_CA_CERTS);
});

const httpServer = http.createServer((req, res) => {
  const redirectUrl = `https://localhost:${httpsport}${req.url}`;
  res.writeHead(301, { "Location": redirectUrl });
  res.end();
});
httpServer.listen(httpport, () => {
  console.log(`HTTP Server running on port ${httpport} and redirecting to HTTPS`);
});

// app.listen(httpport, () => {
//   console.log(`Example app listening on port ${httpport}`);
//   console.log(env.NODE_ENV);
// });
