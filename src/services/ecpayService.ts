import { Request } from 'express';
import * as payModel from '../model/payModel.js';
import { GetCheckMacValue, generateMerchantTradeNo } from '../helpers/ecpayHelper.js';
import config from '../configs/configIndex.js';
import * as ecpayRepository from '../repositorys/ecpayRepository.js';

async function getCheckOut(req: Request): Promise<payModel.ecPayBackendOutput> {
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
    ReturnURL: config.ecpayAioCheckOutconfigs.ReturnURL,
    EncryptType: config.ecpayAioCheckOutconfigs.EncryptType,
    MerchantID: config.ecpayAioCheckOutconfigs.MerchantID,
  };

  await ecpayRepository.createPayment({
    amount: checkoutList.TotalAmount,
    payment_method: checkoutList.ChoosePayment,
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

  // 付款成功
  if (parseResult.data.RtnCode === '1') {
    // 將 yyyy/MM/dd HH:mm:ss 格式轉換為 ISO 8601 格式
    const paidAtISO = new Date(parseResult.data.PaymentDate).toISOString();
    await ecpayRepository.updatePayment(parseResult.data.MerchantTradeNo, {
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

  const { CheckMacValue: returnedMacValue, ...tradeInfo } = result;
  const calculatedMacValue = GetCheckMacValue(tradeInfo);

  if (returnedMacValue !== calculatedMacValue) {
    throw new Error('CheckMacValue does not match');
  }

  // 交易狀態為1，代表已付款
  if (result.TradeStatus === '1') {
    await ecpayRepository.updatePayment(result.MerchantTradeNo, {
      status: 'PAID',
      paid_at: new Date(result.PaymentDate).toISOString(),
    });
  }

  return result;
}

export { getCheckOut, getPayResult, queryTradeInfo };
