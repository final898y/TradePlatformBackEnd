interface ecPayBackendOutput {
  CheckMacValue: string;
  MerchantTradeNo: string;
}

interface ecPayFrountendInput {
    MerchantID: string;
    MerchantTradeDate:string;
    PaymentType: string;
    TotalAmount:number;
    TradeDesc:string;
    ItemName:string;
    ReturnURL:string;
    ChoosePayment:string;
    EncryptType:number
  }

interface ecPaycheckoutList{
    MerchantID: string;
    MerchantTradeNo:string;
    MerchantTradeDate:string;
    PaymentType: string;
    TotalAmount:number;
    TradeDesc:string;
    ItemName:string;
    ReturnURL:string;
    ChoosePayment:string;
    EncryptType:number
}
 export {ecPayBackendOutput,ecPayFrountendInput,ecPaycheckoutList}