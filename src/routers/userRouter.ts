import express from 'express';
import wrapAsync from '../helpers/wrapAsyncHelper.js';
import * as UserController from '../controllers/userController.js';
import authenticateToken from '../middlewares/authorization.js';
const router = express.Router();

router.get('/search', wrapAsync(UserController.GetUserDetail));
router.get('/list', wrapAsync(UserController.GetAllUsers));
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', wrapAsync(UserController.Register));
router.put('/edit', wrapAsync(authenticateToken), wrapAsync(UserController.EditUser));
router.post('/login', wrapAsync(UserController.Login));

export default router;
