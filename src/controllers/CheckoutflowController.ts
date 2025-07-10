import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as checkoutflowService from '../services/checkoutflowService.js';

export const createOrderFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await checkoutflowService.createOrderFromCart(req);
    res.status(transportResult.statusCode).json({
      success: true,
      message: '創建訂單成功',
      data: { orderNumber: transportResult.data?.orderNumber },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法創建訂單，請稍後再試。'));
    }
  }
};

export const getOrderByOrderNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderNumber = req.params.orderNumber;
    const transportResult = await checkoutflowService.getOrderByOrderNumber(orderNumber);
    res.status(transportResult.statusCode).json(transportResult);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法查詢訂單，請稍後再試。'));
    }
  }
};

export const getOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 從 URL query 中獲取 userUuid
    const userUuid = req.query.userUuid as string;

    if (!userUuid) {
      return next(new ApiError(400, '請求中缺少 userUuid 查詢參數'));
    }

    // 簡單的 UUID 格式驗證
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(userUuid)) {
      return next(new ApiError(400, 'userUuid 格式不正確'));
    }

    // 呼叫 service 獲取訂單
    const transportResult = await checkoutflowService.getOrdersByUserUuid(userUuid);

    // 回傳結果
    res.status(transportResult.statusCode).json(transportResult);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法查詢訂單，請稍後再試。'));
    }
  }
};
