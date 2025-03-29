import { Request } from 'express';
import * as payModel from '../model/payModel.js';
import * as linepayHelper from '../helpers/linepayHelper.js';

async function paymentRequest(req: Request): Promise<string> {
  const inputData: unknown = req.body;
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
  const linePRresult = await linepayHelper.requestLineAPI(inputOption,'request');
  if ("info" in linePRresult && "paymentUrl" in linePRresult.info) {
    return linePRresult.info.paymentUrl.web; // 確定是 LinePaymentPRResponse
} else {
    throw new Error('回傳類型錯誤');
}
}

async function paymentconfirmation(req: Request): Promise<number> {
  const inputData: unknown = req.body;
  if (!inputData) {
    throw new Error('Request body解析錯誤');
  }
  const parseResult = payModel.LinePaymentPCFrountendInputSchema.safeParse(inputData);
  if (!parseResult.success) {
    throw new Error(`前端輸出資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }
  const transactionId = parseResult.data.transactionId;
  //const orderId = parseResult.data.orderId;
  const databaseData= {
    amount: 100,//先寫死應該要從資料庫取資料確認
    currency: 'TWD',
  }
  const inputOption={
    method: 'POST',
    baseUrl: 'https://sandbox-api-pay.line.me',
    apiPath:`/v3/payments/${transactionId}/confirm`,
    queryString: '',
    data: databaseData,
    signal: null,
  }
  const linePCresult = await linepayHelper.requestLineAPI(inputOption,'confirm');
  if ("info" in linePCresult && "payInfo" in linePCresult.info) {
    return linePCresult.info.payInfo[0].amount; // 確定是 LinePaymentPCResponse
} else {
    throw new Error('回傳類型錯誤');
}
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

export { paymentRequest,paymentconfirmation};
