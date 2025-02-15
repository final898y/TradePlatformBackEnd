import { Request } from 'express';
import { ecPayFrountendInput, ecPayBackendOutput } from '../model/payModel.js';
import { GetCheckMacValue } from '../helpers/payHelper.js';

function getCheckOut(req: Request): ecPayBackendOutput {
  const inputData: ecPayFrountendInput = req.body;
  const MerchantTradeNo = crypto.randomUUID().replace(/-/g, '').substring(0, 20);
  let checkoutList = {
    ...inputData,
    MerchantTradeNo: MerchantTradeNo,
  };
  return {
    MerchantTradeNo: MerchantTradeNo,
    CheckMacValue: GetCheckMacValue(checkoutList),
  };
}

export { getCheckOut };
