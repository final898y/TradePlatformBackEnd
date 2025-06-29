import { Request } from 'express';
import * as payModel from '../model/payModel.js';
import { GetCheckMacValue, generateMerchantTradeNo } from '../helpers/ecpayHelper.js';

function getCheckOut(req: Request): payModel.ecPayBackendOutput {
  const inputData: unknown = req.body;
  if (!inputData) {
    throw new Error('Request body解析錯誤');
  }
  const parseResult = payModel.ecPayFrountendInputSchema.safeParse(inputData);
  if (!parseResult.success) {
    throw new Error(`資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }
  const MerchantTradeNo = generateMerchantTradeNo();
  const checkoutList = {
    ...parseResult.data,
    MerchantTradeNo: MerchantTradeNo,
  };
  return {
    MerchantTradeNo: MerchantTradeNo,
    CheckMacValue: GetCheckMacValue(checkoutList),
  };
}

function getPayResult(req: Request): string {
  const inputData: unknown = req.body;
  if (!inputData) {
    throw new Error('Request body解析錯誤');
  }
  const parseResult = payModel.PaymentResultSchema.safeParse(inputData);
  if (!parseResult.success) {
    throw new Error(`資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }

  const { CheckMacValue, ...newData } = parseResult.data;
  const caculatMacValue = GetCheckMacValue(newData);
  if (CheckMacValue == caculatMacValue) {
    return '1|OK';
  } else {
    return 'CheckMacValue dont match';
  }
}

export { getCheckOut, getPayResult };
