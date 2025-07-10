import { supabase } from '../helpers/supaBaseHelper.js';
import type { FrountendPaymentInsert, Payments } from '../model/payModel.js';
import ItransportResult from '../model/transportModel.js';

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

export async function getPaymentByTransactionId(
  transactionId: string,
): Promise<ItransportResult<Payments>> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();

  if (error) {
    return { success: false, statusCode: 500, message: error.message };
  }
  return { success: true, statusCode: 200, message: '查詢付款資料成功', data: data };
}

export async function getPaymentByOrderNumber(
  orderNumber: string,
): Promise<ItransportResult<Payments>> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      payments (*)
    `,
    )
    .eq('order_number', orderNumber)
    .order('created_at', { referencedTable: 'payments', ascending: false })
    .limit(1, { referencedTable: 'payments' })
    .single();

  if (error) {
    return { success: false, statusCode: 500, message: error.message };
  }
  const paymentData = Array.isArray(data.payments) ? data.payments[0] : data.payments;
  if (!paymentData) {
    return { success: false, statusCode: 404, message: '找不到此訂單的付款資料' };
  }
  return { success: true, statusCode: 200, message: '查詢付款資料成功', data: paymentData };
}
