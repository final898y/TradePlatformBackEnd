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

const getQueryTradeInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantTradeNo } = req.params;
    const tradeInfo = await ecpayService.queryTradeInfo(merchantTradeNo);
    res.status(200).json(tradeInfo);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching trade info'));
    }
  }
};

export { getCheckOut, getPayResult, getQueryTradeInfo };
