import express from 'express';
import ecpayRouter from './pay/ecpayRouter.js';
const router = express.Router();


router.use('/ecpay',ecpayRouter)

export default router;