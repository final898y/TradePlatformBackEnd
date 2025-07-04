import express from 'express';
import * as ecpayController from '../../controllers/ecpayController.js';
const router = express.Router();

router.post('/getcheckout', ecpayController.getCheckOut);
router.post('/getpayresult', ecpayController.getPayResult);
router.get('/query-trade-info/:merchantTradeNo', ecpayController.getQueryTradeInfo);

export default router;
