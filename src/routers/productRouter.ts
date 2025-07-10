import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as ProductController from '../controllers/productController.js';
const router = express.Router();

router.get('/getallproducts', wrapAsync(ProductController.getAllProducts));
router.get('/getproductbyid/:id', wrapAsync(ProductController.getProductByID));
router.get('/getcategories', wrapAsync(ProductController.getProductsCategories));
export default router;
