import pgSQLpool from '../helpers/postgresqlHelper.js';
import { getUserIdByUuid } from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';
import * as checkoutflowModel from '../model/checkoutflowModel.js';
import { generateOrderNumber } from '../helpers/checkoutflowHelper.js';
import { supabase } from '../helpers/supaBaseHelper.js';

export async function createOrderFromCart(
  checkoutrequest: checkoutflowModel.CheckoutRequest,
): Promise<ItransportResult<{ orderNumber: string }>> {
  const client = await pgSQLpool.connect();

  try {
    // 開始交易
    await client.query('BEGIN');

    const {
      userUuid,
      shipping_address,
      order_note,
      recipient_name,
      recipient_phone,
      recipient_email,
      payment_method,
    } = checkoutrequest;
    // 查詢使用者 ID
    const userId = await getUserIdByUuid(userUuid);
    if (!userId) throw new Error('使用者不存在');

    // 查詢購物車項目（含價格與庫存）
    const { rows: cartItems }: { rows: checkoutflowModel.CartItem[] } = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [userId],
    );

    if (cartItems.length === 0) throw new Error('購物車為空');

    // 檢查庫存是否足夠
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(`商品 ID ${item.product_id} 庫存不足`);
      }
    }

    // 計算總金額
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    const orderNumber = generateOrderNumber();

    // 建立訂單
    const { rows: newOrderRows } = await client.query(
      `INSERT INTO orders (
        order_number, user_id, total_amount, status,
        shipping_address, order_note, recipient_name, recipient_phone,
        recipient_email, payment_method
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        orderNumber,
        userId,
        totalAmount,
        checkoutflowModel.OrderStatus.Pending,
        shipping_address,
        order_note,
        recipient_name,
        recipient_phone,
        recipient_email,
        payment_method,
      ],
    );
    const orderId = newOrderRows[0].id;

    // 插入 order_items 並扣除庫存
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price],
      );

      const { rowCount } = await client.query(
        `UPDATE products SET stock = stock - $1 
         WHERE id = $2 AND stock >= $1`,
        [item.quantity, item.product_id],
      );

      if (rowCount === 0) {
        throw new Error(`商品 ID ${item.product_id} 扣庫存失敗，可能已售完`);
      }
    }

    // 清空購物車
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    // 提交交易
    await client.query('COMMIT');
    return {
      success: true,
      statusCode: 200,
      message: '訂單建立成功',
      data: { orderNumber },
    };
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('訂單建立失敗：', error);
    return {
      success: false,
      statusCode: 500,
      message: error.message || '建立訂單失敗',
    };
  } finally {
    client.release();
  }
}

export async function getOrderByOrderNumber(
  orderNumber: string,
): Promise<ItransportResult<checkoutflowModel.OrderDetail>> {
  const client = await pgSQLpool.connect();
  try {
    const query = `
      SELECT
        o.id as order_id,
        o.order_number,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.order_note,
        o.recipient_name,
        o.recipient_phone,
        o.recipient_email,
        o.payment_method,
        o.created_at,
        o.paid_at,
        json_agg(json_build_object(
          'product_id', p.id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price
        )) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.order_number = $1
      GROUP BY o.id;
    `;

    const { rows } = await client.query(query, [orderNumber]);

    if (rows.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: '找不到該訂單',
      };
    }

    const validation = checkoutflowModel.orderDetailSchema.safeParse(rows[0]);

    if (!validation.success) {
      console.error('資料庫查詢結果不符合預期格式：', validation.error);
      return {
        success: false,
        statusCode: 500,
        message: '資料庫回傳格式錯誤',
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: '查詢訂單成功',
      data: validation.data,
    };
  } catch (error: any) {
    console.error('查詢訂單失敗：', error);
    return {
      success: false,
      statusCode: 500,
      message: error.message || '查詢訂單失敗',
    };
  } finally {
    client.release();
  }
}

export async function updatePayment(
  transactionId: string,
  paymentData: checkoutflowModel.PaymentUpdate,
) {
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
