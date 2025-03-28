import { Request, Response, NextFunction } from 'express';
import * as ecpayService from '../services/ecpayService.js';
import { ApiError } from '../middlewares/errorHandler.js';

const getCheckOut = (req: Request, res: Response, next: NextFunction) => {
  try {
    const output = ecpayService.getCheckOut(req);
    res.status(200).json(output);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching checkout data'));
    }
  }
};

const getPayResult = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req) {
      const output: string = ecpayService.getPayResult(req);
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

export { getCheckOut, getPayResult };
