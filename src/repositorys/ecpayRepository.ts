import { supabase } from '../helpers/supaBaseHelper.js';
import { TablesInsert, TablesUpdate } from '../model/supabaseModel.js';

type PaymentInsert = TablesInsert<'payments'>;
type PaymentUpdate = TablesUpdate<'payments'>;

export async function createPayment(paymentData: PaymentInsert) {
  const { data, error } = await supabase.from('payments').insert(paymentData).select();

  if (error) {
    throw new Error(`建立付款資料失敗: ${error.message}`);
  }
  return data;
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
