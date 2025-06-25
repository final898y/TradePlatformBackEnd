import express from 'express';
import HealthRouter from './healthRouter.js';
import UserRouter from './userRouter.js';
import PayRouter from './payRouter.js';
import TestRouter from './testRouter.js';
import AuthRouter from './authRouter.js';
import ProductRouter from './productRouter.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' with { type: 'json' };

const router = express.Router();

router.use('/health', HealthRouter);

router.use('/users', UserRouter);
router.use('/products', ProductRouter);
router.use('/pay', PayRouter);
router.use('/tests', TestRouter);
router.use('/auth', AuthRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Home page route.
router.get('/', (req, res) => {
  res.render('index', { title: 'TradePlatform', message: '首頁' });
});

// About page route.
router.get('/about', (req, res) => {
  res.send('About The Concept');
});

export default router;
