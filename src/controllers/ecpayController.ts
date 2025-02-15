import { Request, Response } from 'express';
import { ecPayFrountendInput, ecPayBackendOutput } from '../model/payModel.js';
import * as ecpayService from '../services/ecpayService.js';

const getCheckOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const output: ecPayBackendOutput = await ecpayService.getCheckOut(req);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching checkOut Data');
  }
};

const getPayResult = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req) {
      console.log(req.body);
      res.status(200).send(req.body);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching Pay Result');
  }
};

export { getCheckOut, getPayResult };
