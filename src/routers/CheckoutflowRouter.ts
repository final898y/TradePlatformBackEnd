import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as CheckoutflowController from '../controllers/CheckoutflowController.js';
const router = express.Router();

router.post('/createOrderFromCart', wrapAsync(CheckoutflowController.createOrderFromCart));
router.get('/order/:orderNumber', wrapAsync(CheckoutflowController.getOrderByOrderNumber));

export default router;
