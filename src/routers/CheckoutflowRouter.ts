import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as CheckoutflowController from '../controllers/CheckoutflowController.js';
const router = express.Router();

router.post('/createOrderFromCart', wrapAsync(CheckoutflowController.createOrderFromCart));

export default router;
