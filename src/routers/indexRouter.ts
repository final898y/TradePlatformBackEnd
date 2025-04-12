import express from 'express';
import UserRouter from './userRouter.js';
import PayRouter from './payRouter.js';
import TestRouter from './testRouter.js';
import googleAuthRouter from './googleAuthRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' with { type: 'json' };

const router = express.Router();

router.use('/users', UserRouter);
router.use('/pay', PayRouter);
router.use('/tests', TestRouter);
router.use('/googleAuth', googleAuthRouter);
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
