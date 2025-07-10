import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as cartService from '../services/cartService.js';

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.addToCart(req);
    const { statusCode, success, message, data } = transportResult;
    res.status(statusCode).json({ success: success, message: message });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法加入購物車，請稍後再試。'));
    }
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.updateCartItem(req);
    const { statusCode, success, message, data } = transportResult;
    res.status(statusCode).json({ success: success, message: message });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法更新購物車，請稍後再試。'));
    }
  }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.deleteCartItem(req);
    const { statusCode, success, message, data } = transportResult;
    res.status(statusCode).json({ success: success, message: message });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法刪除購物車，請稍後再試。'));
    }
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.clearCart(req);
    const { statusCode, success, message, data } = transportResult;
    res.status(statusCode).json({ success: success, message: message });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法清空購物車，請稍後再試。'));
    }
  }
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const transportResult = await cartService.getCart(req);
  const { statusCode, success, message, data } = transportResult;
  res.status(statusCode).json({ success: success, message: message, data: data });
};
