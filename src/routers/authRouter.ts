import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as googleAuthController from '../controllers/googleAuthController.js';
import * as AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/verifyGoogleIdToken', wrapAsync(googleAuthController.verifyGoogleIdToken));
router.get('/getCsrfToken', wrapAsync(googleAuthController.getCsrfToken));
router.get('/refresh', wrapAsync(AuthController.refresh));
export default router;
