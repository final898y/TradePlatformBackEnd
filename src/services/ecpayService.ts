import { Request } from 'express';
import * as payModel from '../model/payModel.js';
import { GetCheckMacValue, generateMerchantTradeNo } from '../helpers/ecpayHelper.js';
import config from '../configs/configIndex.js';
import * as ecpayRepository from '../repositorys/ecpayRepository.js';
import * as checkoutflowRepository from '../repositorys/checkoutflowRepository.js';
import ItransportResult from '../model/transportModel.js';

async function getCheckOut(req: Request): Promise<payModel.ecPayBackendOutput> {
  const inputData: unknown = req.body;
  if (!inputData) {
    throw new Error('Request body解析錯誤');
  }
  const parseResult = payModel.ecPayFrountendInputSchema.safeParse(inputData);
  if (!parseResult.success) {
    throw new Error(`資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }
  //TODO: 檢查 OrderNumber 在資料庫中對應的多項PAYMENT中是否已經付款完成過。

  const MerchantTradeNo = generateMerchantTradeNo();
  const { OrderNumber, ...parseResultWithoutOrderNumber } = parseResult.data;

  const checkoutList = {
    ...parseResultWithoutOrderNumber,
    MerchantTradeNo: MerchantTradeNo,
    ReturnURL: config.ecpayAioCheckOutconfigs.ReturnURL,
    EncryptType: config.ecpayAioCheckOutconfigs.EncryptType,
    MerchantID: config.ecpayAioCheckOutconfigs.MerchantID,
  };

  await ecpayRepository.createPayment({
    order_number: OrderNumber,
    amount: checkoutList.TotalAmount,
    payment_method: 'ecpay',
    status: 'PENDING',
    transaction_id: MerchantTradeNo,
  });

  return {
    MerchantTradeNo: MerchantTradeNo,
    CheckMacValue: GetCheckMacValue(checkoutList),
    ReturnURL: config.ecpayAioCheckOutconfigs.ReturnURL,
    EncryptType: config.ecpayAioCheckOutconfigs.EncryptType,
    MerchantID: config.ecpayAioCheckOutconfigs.MerchantID,
  };
}

async function getPayResult(req: Request): Promise<string> {
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

  if (CheckMacValue !== caculatMacValue) {
    return 'CheckMacValue dont match';
  }
  const tradeInfo = await queryTradeInfo(parseResult.data.MerchantTradeNo);

  // 付款成功
  if (parseResult.data.RtnCode === '1' && tradeInfo.TradeStatus === '1') {
    // 將 yyyy/MM/dd HH:mm:ss 格式轉換為 ISO 8601 格式
    const paidAtISO = new Date(parseResult.data.PaymentDate).toISOString();
    await checkoutflowRepository.updatePayment(parseResult.data.MerchantTradeNo, {
      status: 'PAID',
      paid_at: paidAtISO,
    });
  }

  return '1|OK';
}

async function queryTradeInfo(merchantTradeNo: string) {
  const queryParams = {
    MerchantID: config.ecpayAioCheckOutconfigs.MerchantID,
    MerchantTradeNo: merchantTradeNo,
    TimeStamp: Math.floor(Date.now() / 1000).toString(),
  };

  const checkMacValue = GetCheckMacValue(queryParams);

  const postData = new URLSearchParams({
    ...queryParams,
    CheckMacValue: checkMacValue,
  });

  const response = await fetch('https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: postData,
  });

  const responseText = await response.text();
  const decodedResponse = new URLSearchParams(responseText);

  const result: { [key: string]: string } = {};
  for (const [key, value] of decodedResponse.entries()) {
    result[key] = value;
  }

  const parsed = payModel.ecPayQueryTradeInfoResponseSchema.safeParse(result);

  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error('回傳資料格式錯誤');
  }
  const { CheckMacValue: returnedMacValue, ...tradeInfo } = parsed.data;
  const calculatedMacValue = GetCheckMacValue(tradeInfo);

  if (returnedMacValue !== calculatedMacValue) {
    throw new Error('CheckMacValue does not match');
  }

  // 交易狀態為1，代表已付款
  // if (tradeInfo.TradeStatus === '1') {
  //   await ecpayRepository.updatePayment(result.MerchantTradeNo, {
  //     status: 'PAID',
  //     paid_at: new Date(result.PaymentDate).toISOString(),
  //   });
  // }

  return tradeInfo;
}

export async function getPaymentByTransactionId(
  req: Request,
): Promise<ItransportResult<payModel.Payments>> {
  const transactionId = req.query.transactionId;
  if (typeof transactionId !== 'string') {
    return {
      success: false,
      statusCode: 400,
      message: `Request.Query資料格式錯誤`,
    };
  }
  return await ecpayRepository.getPaymentByTransactionId(transactionId);
}

export async function getPaymentByOrderNumber(
  req: Request,
): Promise<ItransportResult<payModel.Payments>> {
  const orderNumber = req.query.orderNumber;
  if (typeof orderNumber !== 'string') {
    return {
      success: false,
      statusCode: 400,
      message: `Request.Query資料格式錯誤`,
    };
  }
  return await ecpayRepository.getPaymentByOrderNumber(orderNumber);
}

export { getCheckOut, getPayResult, queryTradeInfo };
