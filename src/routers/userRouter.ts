import express from 'express';
import * as UserController from '../controllers/userController.js';
import authenticateToken from '../middlewares/authorization.js';
const router = express.Router();

router.get('/search', UserController.GetUserDetail);
router.get('/list', UserController.GetAllUsers);
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', UserController.Register);
router.put('/edit',authenticateToken, UserController.EditUser);
router.post('/login', UserController.Login);

export default router;
