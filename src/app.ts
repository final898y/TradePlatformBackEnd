import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import env from './configs/env.js';
import config from './configs/configIndex.js';

import IndexRouter from './routers/indexRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { gracefulShutdown } from './utility/shutdown.js';
import { client as redisClient } from './helpers/redisHelper.js';

// 🔥 定義變數，方便後續 shutdown
let httpsServer: https.Server | undefined;
let httpServer: http.Server | undefined;
let server: http.Server | undefined;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpport: number = env.HTTPPORT;
const httpsport: number = env.HTTPSPORT;

app.set('view engine', 'pug');
app.set('views', './views');

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
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

if (env.NODE_ENV === 'development') {
  const privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'));
  const certificate = fs.readFileSync(path.join(__dirname, 'cert.crt'));

  httpsServer = https.createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app,
  );
  httpsServer.listen(httpsport, () => {
    console.log(`Example app listening at https://localhost:${httpsport}`);
  });

  httpServer = http.createServer((req, res) => {
    const redirectUrl = `https://localhost:${httpsport}${req.url}`;
    res.writeHead(301, { Location: redirectUrl });
    res.end();
  });
  httpServer.listen(httpport, () => {
    console.log(`HTTP Server running on port ${httpport} and redirecting to HTTPS`);
  });
} else {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// 優雅關閉
process.on('SIGINT', () =>
  gracefulShutdown({ servers: [server, httpsServer, httpServer], redisClient: redisClient }),
);
process.on('SIGTERM', () =>
  gracefulShutdown({ servers: [server, httpsServer, httpServer], redisClient: redisClient }),
);
