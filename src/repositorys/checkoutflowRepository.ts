import pgSQLpool from '../helpers/postgresqlHelper.js';
import { getUserIdByUuid } from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';
import { CheckoutRequest } from '../model/checkoutflowModel.js';
import { generateOrderNumber } from '../helpers/checkoutflowHelper.js';

export async function createOrderFromCart(
  checkoutrequest: CheckoutRequest,
): Promise<ItransportResult<{ orderNumber: string }>> {
  const client = await pgSQLpool.connect();

  try {
    // 開始交易
    await client.query('BEGIN');

    const {
      userUuid,
      shipping_address,
      recipient_name,
      recipient_phone,
      recipient_email,
      payment_method,
    } = checkoutrequest;
    // 查詢使用者 ID
    const userId = await getUserIdByUuid(userUuid);
    if (!userId) throw new Error('使用者不存在');

    // 查詢購物車項目（含價格與庫存）
    const { rows: cartItems } = await client.query(
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
        shipping_address, recipient_name, recipient_phone,
        recipient_email, payment_method
      ) VALUES ($1,$2,$3,'pending',$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        orderNumber,
        userId,
        totalAmount,
        shipping_address,
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
