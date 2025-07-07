import { Request, Response, NextFunction } from 'express';
import * as ecpayService from '../services/ecpayService.js';
import { ApiError } from '../middlewares/errorHandler.js';

const getCheckOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const output = await ecpayService.getCheckOut(req);
    res.status(200).json(output);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching checkout data'));
    }
  }
};

const getPayResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req) {
      const output: string = await ecpayService.getPayResult(req);
      res.status(200).send(output);
    }
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching PayResult data'));
    }
  }
};

const queryTradeInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderNumber } = req.params;
    const tradeInfo = await ecpayService.queryTradeInfo(orderNumber);
    res.status(200).json(tradeInfo);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching trade info'));
    }
  }
};

const getPaymentByTransactionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const output = await ecpayService.getPaymentByTransactionId(req);
    res.status(output.statusCode).json(output);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching trade info'));
    }
  }
};

const getPaymentByOrderNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const output = await ecpayService.getPaymentByOrderNumber(req);
    res.status(output.statusCode).json(output);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching trade info'));
    }
  }
};

export { getCheckOut, getPayResult, queryTradeInfo, getPaymentByTransactionId, getPaymentByOrderNumber };
