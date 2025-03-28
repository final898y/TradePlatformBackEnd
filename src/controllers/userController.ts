import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/userService.js';
import { ApiError } from '../middlewares/errorHandler.js';

const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await UserService.GetAllUsers();
    res.status(transportResult.statusCode).send(transportResult);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching users'));
    }
  }
};

const GetUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  const UID = req.query.uid as string;
  try {
    const transportResult = await UserService.GetUserDetail(UID);
    res.status(transportResult.statusCode).send(transportResult);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching user'));
    }
  }
};

const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await UserService.Register(req);
    res.status(transportResult.statusCode).json(transportResult.message);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '註冊失敗'));
    }
  }
};

const EditUser = async (req: Request, res: Response, next: NextFunction) => {
  const UID = req.query.uid as string;
  try {
    const transportResult = await UserService.EditUser(req, UID);
    res.status(transportResult.statusCode).send(transportResult.message);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '更新資料失敗'));
    }
  }
};

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await UserService.Login(req);
    res.status(transportResult.statusCode).json({
      message: transportResult.message,
      JwtToket: transportResult.JwtToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '登入失敗'));
    }
  }
};

export { GetAllUsers, GetUserDetail, Register, EditUser, Login };
