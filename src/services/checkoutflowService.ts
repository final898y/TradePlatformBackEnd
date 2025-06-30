import * as checkoutflowRepository from '../repositorys/checkoutflowRepository.js';
import ItransportResult from '../model/transportModel.js';
import { Request } from 'express';
import { checkoutRequestSchema } from '../model/checkoutflowModel.js';

export const createOrderFromCart = async (
  req: Request,
): Promise<ItransportResult<{ orderNumber: string }>> => {
  try {
    const parseresult = checkoutRequestSchema.safeParse(req.body);
    if (!parseresult.success) {
      const errorMessages = Object.values(parseresult.error.format())
        .map((e: any) => e?._errors?.[0])
        .filter(Boolean)
        .join('; ');
      return {
        success: false,
        statusCode: 400,
        message: `資料格式錯誤：${errorMessages}`,
      };
    }
    return await checkoutflowRepository.createOrderFromCart(parseresult.data);
  } catch (error) {
    throw error;
  }
};
