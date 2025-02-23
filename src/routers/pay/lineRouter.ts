import express from 'express';
import * as linepayController from '../../controllers/linepayController.js';
const router = express.Router();

router.post('/paymentRequest', linepayController.paymentRequest);
//router.post('/getpayresult', linepayController.getPayResult);

export default router;
