import { z } from 'zod';

export const ecPayBackendOutputSchema = z.object({
  CheckMacValue: z.string(),
  MerchantTradeNo: z.string(),
});
export type ecPayBackendOutput = z.infer<typeof ecPayBackendOutputSchema>;

export const ecPayFrountendInputSchema = z.object({
  MerchantID: z.string(),
  MerchantTradeDate: z.string(),
  PaymentType: z.string(),
  TotalAmount: z.number(),
  TradeDesc: z.string(),
  ItemName: z.string(),
  ReturnURL: z.string(),
  ChoosePayment: z.string(),
  EncryptType: z.number(),
  ClientBackURL: z.string().optional(),
});
export type ecPayFrountendInput = z.infer<typeof ecPayFrountendInputSchema>;

export const ecPaycheckoutListSchema = z.object({
  MerchantID: z.string(),
  MerchantTradeNo: z.string(),
  MerchantTradeDate: z.string(),
  PaymentType: z.string(),
  TotalAmount: z.number(),
  TradeDesc: z.string(),
  ItemName: z.string(),
  ReturnURL: z.string(),
  ChoosePayment: z.string(),
  EncryptType: z.number(),
});
export type ecPaycheckoutList = z.infer<typeof ecPaycheckoutListSchema>;

export const PaymentResultSchema = z.object({
  MerchantID: z.string(),
  MerchantTradeNo: z.string(),
  StoreID: z.string(),

  // 交易狀態，回傳值為1時，為付款成功。
  // "10300066" 時，代表交易付款結果待確認中，請勿出貨
  RtnCode: z.string(),

  RtnMsg: z.string(),

  // 綠界的交易編號，請保存綠界的交易編號與特店交易編號[MerchantTradeNo]的關連。
  TradeNo: z.string(),
  TradeAmt: z.string(),
  PaymentDate: z.string(),
  PaymentType: z.string(),
  PaymentTypeChargeFee: z.string(),
  TradeDate: z.string(),

  // 是否為模擬付款0：代表此交易非模擬付款。1：代表此交易為模擬付款，RtnCode也為1。
  SimulatePaid: z.string(),
  CustomField1: z.string(),
  CustomField2: z.string(),
  CustomField3: z.string(),
  CustomField4: z.string(),
  CheckMacValue: z.string().optional(),
});
export type PaymentResult = z.infer<typeof PaymentResultSchema>;

// interface ecPayBackendOutput {
//   CheckMacValue: string;
//   MerchantTradeNo: string;
// }

// interface ecPayFrountendInput {
//   MerchantID: string;
//   MerchantTradeDate: string;
//   PaymentType: string;
//   TotalAmount: number;
//   TradeDesc: string;
//   ItemName: string;
//   ReturnURL: string;
//   ChoosePayment: string;
//   EncryptType: number;
// }

// interface ecPaycheckoutList {
//   MerchantID: string;
//   MerchantTradeNo: string;
//   MerchantTradeDate: string;
//   PaymentType: string;
//   TotalAmount: number;
//   TradeDesc: string;
//   ItemName: string;
//   ReturnURL: string;
//   ChoosePayment: string;
//   EncryptType: number;
// }

// interface PaymentResult {
//   MerchantID: string;
//   MerchantTradeNo: string;
//   StoreID: string;

//   //交易狀態，回傳值為1時，為付款成功。
//   //”10300066″ 時，代表交易付款結果待確認中，請勿出貨
//   RtnCode: number;

//   RtnMsg: string;

//   //綠界的交易編號，請保存綠界的交易編號與特店交易編號[MerchantTradeNo]的關連。
//   TradeNo: string;
//   TradeAmt: number;
//   PaymentDate: string;
//   PaymentType: string;
//   PaymentTypeChargeFee: number;
//   TradeDate: string;

//   //是否為模擬付款0：代表此交易非模擬付款。1：代表此交易為模擬付款，RtnCode也為1。
//   SimulatePaid: string;
//   CustomField1: string;
//   CustomField2: string;
//   CustomField3: string;
//   CustomField4: string;
//   CheckMacValue?: string;
// }

// export { ecPayBackendOutput, ecPayFrountendInput, ecPaycheckoutList, PaymentResult };
