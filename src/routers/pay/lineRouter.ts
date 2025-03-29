import express from 'express';
import wrapAsync from '../../helpers/wrapAsyncHelper.js';
import * as linepayController from '../../controllers/linepayController.js';
const router = express.Router();

router.post('/paymentRequest', wrapAsync(linepayController.paymentRequest));
router.post('/paymentConfirm', wrapAsync(linepayController.paymentconfirmation));

//router.post('/getpayresult', linepayController.getPayResult);

export default router;
