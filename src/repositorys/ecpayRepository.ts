import { supabase } from '../helpers/supaBaseHelper.js';
import { TablesUpdate } from '../model/supabaseModel.js';
import { FrountendPaymentInsert } from '../model/payModel.js';

type PaymentUpdate = TablesUpdate<'payments'>;

export async function createPayment(FrountendpaymentData: FrountendPaymentInsert) {
  const { data, error } = await supabase.rpc('insert_payment_by_order_number', {
    p_order_number: FrountendpaymentData.order_number,
    p_transaction_id: FrountendpaymentData.transaction_id,
    p_amount: Math.floor(FrountendpaymentData.amount), // 確保是整數
    p_payment_method: 'ecpay',
  });

  if (error) {
    if (error.message.includes('查無對應的訂單編號')) {
      throw new Error('訂單不存在，請確認您的訂單編號。');
    } else {
      console.error('資料庫錯誤：', error.message);
    }
  } else {
    console.log('插入成功，付款 ID:', data);
  }
}

export async function updatePayment(transactionId: string, paymentData: PaymentUpdate) {
  const { data, error } = await supabase
    .from('payments')
    .update(paymentData)
    .eq('transaction_id', transactionId)
    .select();

  if (error) {
    throw new Error(`更新付款資料失敗: ${error.message}`);
  }
  return data;
}

export async function getPaymentByTransactionId(transactionId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();

  if (error) {
    throw new Error(`查詢付款資料失敗: ${error.message}`);
  }
  return data;
}
