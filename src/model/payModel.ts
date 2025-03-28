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

  //特店訂單編號均為唯一值，不可重複使用。
  MerchantTradeNo: z.string(),

  MerchantTradeDate: z.string(),
  PaymentType: z.string(),
  TotalAmount: z.number(),
  TradeDesc: z.string(),
  ItemName: z.string(),

  //ReturnURL為付款結果通知回傳網址，為特店server或主機的URL，用來接收綠界後端回傳的付款結果通知。
  ReturnURL: z.string(),
  ChoosePayment: z.string(),

  //固定填入1，使用SHA256加密。
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

//LinePay----------
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  imageUrl: z.string().url().optional(),
  quantity: z.number().int(),
  price: z.number(),
});
const packageSchema = z.object({
  id: z.string(), //套裝產品ID
  name: z.string().optional(),
  amount: z.number(),
  products: z.array(productSchema),
  userFee: z.number().optional(),
});
const redirectUrlsSchema = z.object({
  confirmUrl: z.string().url(),
  cancelUrl: z.string().url(),
});
export const linePayPRDataSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  orderId: z.string(),
  packages: z.array(packageSchema),
  redirectUrls: redirectUrlsSchema,
});
export const linePayPRInputOptionSchema = z.object({
  method: z.string(),
  baseUrl: z.string().url(),
  apiPath: z.string(),
  queryString: z.string(),
  data: linePayPRDataSchema,
});
export type linePayPRInputOption = z.infer<typeof linePayPRInputOptionSchema>;

export const linepayPRFrountendInputSchema = z.object({
  name: z.string(),
  quantity: z.number().int(),
  price: z.number(),
});
export type linePayPRFI = z.infer<typeof linepayPRFrountendInputSchema>;

// 定義 paymentUrl 的 schema
const PaymentUrlSchema = z.object({
  web: z.string().url(),
  app: z.string(),
  universal: z.string().url().optional(),
});

// 定義 info 的 schema
const InfoSchema = z.object({
  paymentUrl: PaymentUrlSchema,
  transactionId: z.string(),
  paymentAccessToken: z.string(),
});

// 定義整體回應的 schema
export const LinePaymentResponseSchema = z.object({
  returnCode: z.literal('0000'),
  returnMessage: z.string(),
  info: InfoSchema,
});
export type LinePaymentResponse = z.infer<typeof LinePaymentResponseSchema>;
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
