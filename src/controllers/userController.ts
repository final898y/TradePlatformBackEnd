import { Request, Response } from 'express';
import * as UserService from '../services/userService.js';

const GetAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const transportResult = await UserService.GetAllUsers();
    res.status(transportResult.statusCode).send(transportResult);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user');
  }
};

const GetUserDetail = async (req: Request, res: Response): Promise<void> => {
  const UID = req.query.uid as string;
  try {
    const transportResult = await UserService.GetUserDetail(UID);
    res.status(transportResult.statusCode).send(transportResult);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user');
  }
};

const Register = async (req: Request, res: Response): Promise<void> => {
  try {
    const transportResult = await UserService.Register(req);
    res.status(transportResult.statusCode).json(transportResult.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '註冊失敗', error });
  }
};

const EditUser = async (req: Request, res: Response): Promise<void> => {
  const UID = req.query.uid as string;
  try {
    const transportResult = await UserService.EditUser(req, UID);
    res.status(transportResult.statusCode).send(transportResult.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '更新資料失敗', error });
  }
};

const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const transportResult = await UserService.Login(req);
    res.status(transportResult.statusCode).json({
      'message':transportResult.message,'JwtToket':transportResult.JwtToken});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '登入失敗', error });
  }
};

export { GetAllUsers, GetUserDetail, Register, EditUser, Login };
