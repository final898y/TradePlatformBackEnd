import { Request } from 'express';
import * as payModel from '../model/payModel.js';
import * as linepayHelper from '../helpers/linepayHelper.js';

async function paymentRequest(req: Request): Promise<any> {
  const inputData = req.body;
  if (!inputData) {
    throw new Error('Request body解析錯誤');
  }
  const parseResult = payModel.linepayPRFrountendInputSchema.safeParse(inputData);
  if (!parseResult.success) {
    throw new Error(`前端輸出資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }

  const inputOption: payModel.linePayPRInputOption = linepayHelper.createLinePRrequestOption(
    parseResult.data,
  );
  let linePRresult = await linepayHelper.requestLineAPI(inputOption);

  const parseResponResult = payModel.LinePaymentResponseSchema.safeParse(linePRresult);
  if (!parseResponResult.success) {
    throw new Error(`line回傳資料驗證錯誤: ${JSON.stringify(parseResponResult.error)}`);
  }
  return parseResponResult.data.info.paymentUrl.web;
}

// function getPayResult(req: Request): string {
//   const inputData = req.body;
//   if (!inputData) {
//     throw new Error('Request body解析錯誤');
//   }
//   const parseResult = payModel.PaymentResultSchema.safeParse(inputData);
//   if (!parseResult.success) {
//     throw new Error(`資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
//   }

//   const { CheckMacValue, ...newData } = parseResult.data;
//   let caculatMacValue = GetCheckMacValue(newData);
//   if (parseResult.data['CheckMacValue'] == caculatMacValue) {
//     return '1|OK';
//   } else {
//     return 'CheckMacValue dont match';
//   }
// }

export { paymentRequest };
