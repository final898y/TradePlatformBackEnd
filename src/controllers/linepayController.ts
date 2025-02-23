import { Request, Response } from 'express';
import * as linepayService from '../services/linepayService.js';

const paymentRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const output: string = await linepayService.paymentRequest(req);
    res.status(200).send(output);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching Data');
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

export { paymentRequest };
