import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import env from './env.js';
import IndexRouter from './routers/indexRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpport: number = env.HTTPPORT;
const httpsport: number = env.HTTPSPORT;

app.set('view engine', 'pug');
app.set('views', './views');

const allowedOrigins: string[] = [
  'http://localhost:3000',
  'https://localhost:443',
  'http://localhost:5173',
  'https://localhost:5173',
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api', IndexRouter);

app.get('/axios', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'axiosTest.html'));
});

// 註冊全局錯誤處理中介軟體（必須放在所有路由的最後）
app.use(errorHandler);

const privateKey = fs.readFileSync('src/key.pem');
const certificate = fs.readFileSync('src/cert.crt');

const httpsServer = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app,
);
httpsServer.listen(httpsport, () => {
  console.log(`Example app listening at https://localhost:${httpsport}`);
  console.log(env.NODE_ENV);
  console.log(process.env.NODE_EXTRA_CA_CERTS);
});

const httpServer = http.createServer((req, res) => {
  const redirectUrl = `https://localhost:${httpsport}${req.url}`;
  res.writeHead(301, { Location: redirectUrl });
  res.end();
});
httpServer.listen(httpport, () => {
  console.log(`HTTP Server running on port ${httpport} and redirecting to HTTPS`);
});

// app.listen(httpport, () => {
//   console.log(`Example app listening on port ${httpport}`);
//   console.log(env.NODE_ENV);
// });
