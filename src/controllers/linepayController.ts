import { Request, Response, NextFunction } from 'express';
import * as linepayService from '../services/linepayService.js';
import { ApiError } from '../middlewares/errorHandler.js';

const paymentRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const output: string = await linepayService.paymentRequest(req);
    res.status(200).send(output);
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching Linepay Request data'));
    }
  }
};

const paymentconfirmation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const output: number = await linepayService.paymentconfirmation(req);
    res.status(200).send(output.toString());
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, 'Error fetching Linepay Confirmation data'));
    }
  }
};

// const getPayResult = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (req) {
//       const output: string = await linepayService.getPayResult(req);
//       res.status(200).send(output);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(`Error:${error}`);
//   }
// };

export { paymentRequest,paymentconfirmation };
