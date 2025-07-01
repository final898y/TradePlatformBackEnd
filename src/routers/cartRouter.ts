import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as CartController from '../controllers/CartController.js';
const router = express.Router();

router.post('/addToCart', wrapAsync(CartController.addToCart));
router.put('/updateCartItem', wrapAsync(CartController.updateCartItem));
router.delete('/carts/:productId', wrapAsync(CartController.deleteCartItem));
router.delete('/clearCart', wrapAsync(CartController.clearCart));
router.get('/getCart', wrapAsync(CartController.getCart));
export default router;
