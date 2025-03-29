import env from '../env.js';
import crypto from 'crypto';
import * as payModel from '../model/payModel.js';
import config from '../configs/linepayConfig.js';

function signKey(clientKey: string, msg: string) {
  const encoder = new TextEncoder();
  return crypto
    .createHmac('sha256', encoder.encode(clientKey))
    .update(encoder.encode(msg))
    .digest('base64');
}

function handleBigInteger(text: string,apiname:string): payModel.LinePaymentPRResponse| payModel.LinePaymentPCResponse{
  const largeNumberRegex = /:\s*(\d{16,})\b/g;
  const processedText = text.replace(largeNumberRegex, ': "$1"');

  const data: unknown = JSON.parse(processedText);
  var parseResponResult;
  if(apiname =='request'){
    parseResponResult = payModel.LinePaymentPRResponseSchema.safeParse(data);
  }
  else{
    parseResponResult = payModel.LinePaymentPCResponseSchema.safeParse(data);
  }
  if (!parseResponResult.success) {
    throw new Error(`line回傳資料驗證錯誤: ${JSON.stringify(parseResponResult.error)}`);
  }
  return parseResponResult.data;
}
export function createLinePRrequestOption(
  linePR_FrInput: payModel.linePayPRFI,
): payModel.linePayPRInputOption {
  const inputproducts = [linePR_FrInput];
  const caculatAmount = linePR_FrInput.price * linePR_FrInput.quantity;
  const inputpackages = [
    {
      id: '1',
      amount: caculatAmount,
      products: inputproducts,
    },
  ];
  const inputredirectUrls = {
    confirmUrl: config.redirectUrls.confirmUrl,
    cancelUrl: config.redirectUrls.cancelUrl,
  };

  const inputOption = {
    method: 'POST',
    baseUrl: 'https://sandbox-api-pay.line.me',
    apiPath: '/v3/payments/request',
    queryString: '',
    data: {
      amount: caculatAmount,
      currency: 'TWD',
      orderId: 'MKSI_S_20180904_1000001',
      packages: inputpackages,
      redirectUrls: inputredirectUrls,
    },
  };
  const parseResult = payModel.linePayPRInputOptionSchema.safeParse(inputOption);
  if (!parseResult.success) {
    throw new Error(`PRInputOption輸出資料格式錯誤: ${JSON.stringify(parseResult.error)}`);
  }
  return parseResult.data;
}

export async function requestLineAPI({
  method = 'GET',
  baseUrl = 'https://sandbox-api-pay.line.me',
  apiPath,
  queryString = '',
  data = null,
  signal = null,
}: {
  method: string;
  baseUrl: string;
  apiPath: string;
  queryString?: string;
  data?: object | null;
  signal?: AbortSignal | null;
},apiname:string): Promise<payModel.LinePaymentPRResponse|payModel.LinePaymentPCResponse> {
  const nonce: string = crypto.randomUUID();
  let signature = '';

  // 根據不同方式(method)生成MAC
  if (method === 'GET') {
    signature = signKey(
      env.linepayapi_ChannelSecretKey,
      env.linepayapi_ChannelSecretKey + apiPath + queryString + nonce,
    );
  } else if (method === 'POST') {
    signature = signKey(
      env.linepayapi_ChannelSecretKey,
      env.linepayapi_ChannelSecretKey + apiPath + JSON.stringify(data) + nonce,
    );
  }

  const headers: Record<string, string> = {
    'X-LINE-ChannelId': env.linepayapi_ChannelID,
    'X-LINE-Authorization': signature,
    'X-LINE-Authorization-Nonce': nonce,
  };

  const response = await fetch(
    `${baseUrl}${apiPath}${queryString !== '' ? '&' + queryString : ''}`,
    {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : null,
      signal: signal ?? undefined,
    },
  );

  const processedResponse = handleBigInteger(await response.text(),apiname);
  return processedResponse;
}
