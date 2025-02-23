import express from 'express';
import ecpayRouter from './pay/ecpayRouter.js';
import lineRouter from './pay/lineRouter.js';
const router = express.Router();

router.use('/ecpay', ecpayRouter);
router.use('/linepay', lineRouter);

export default router;
