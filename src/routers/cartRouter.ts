import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as CartController from '../controllers/CartController.js';
const router = express.Router();

router.post('/getallproducts', wrapAsync(CartController.addToCart));
router.put('/getproductbyid/:id', wrapAsync(CartController.updateCartItem));
router.delete('/getcategories', wrapAsync(CartController.deleteCartItem));
export default router;
