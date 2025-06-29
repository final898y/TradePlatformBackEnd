import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as cartService from '../services/cartService.js';

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.addToCart(req);
    res.status(transportResult.statusCode).json({ success: true, message: '加入購物車成功' });
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
    res.status(transportResult.statusCode).json({ success: true, message: '更新購物車成功' });
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

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await cartService.deleteCartItem(req);
    res.status(transportResult.statusCode).json({ success: true, message: '刪除購物車商品成功' });
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
