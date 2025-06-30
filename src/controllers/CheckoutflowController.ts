import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as checkoutflowService from '../services/checkoutflowService.js';

export const createOrderFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await checkoutflowService.createOrderFromCart(req);
    res
      .status(transportResult.statusCode)
      .json({ success: true, message: '創建訂單成功', data: transportResult.data?.orderNumber });
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
