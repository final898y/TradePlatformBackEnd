import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as googleAuthController from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/verifyGoogleIdToken', wrapAsync(googleAuthController.verifyGoogleIdToken));
router.get('/getCsrfToken', wrapAsync(googleAuthController.getCsrfToken));

export default router;
