import { supabase, getUserIdByUuid } from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';

export async function addToCart(
  userUuid: string,
  productId: number,
  quantity: number,
): Promise<ItransportResult<string>> {
  // 0. 查詢 user_id
  const userId = await getUserIdByUuid(userUuid);
  if (!userId) {
    return { success: false, statusCode: 400, message: '使用者不存在' };
  }
  // 1. 查詢商品庫存
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single();

  if (productError)
    return {
      success: false,
      statusCode: 500,
      message: productError.message,
    };
  if (!product || product.stock < quantity)
    return { success: false, statusCode: 400, message: '商品庫存不足' };

  // 2. 查詢購物車中是否已有該商品
  const { data: existingItem, error: cartError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (cartError && cartError.code !== 'PGRST116')
    return { success: false, statusCode: 500, message: cartError.message };

  if (existingItem) {
    // 3. 若已存在則更新數量
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (updateError) return { success: false, statusCode: 500, message: updateError.message };
  } else {
    // 4. 若不存在則新增一筆
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity });

    if (insertError) return { success: false, statusCode: 500, message: insertError.message };
  }

  return { success: true, statusCode: 200, message: '加入購物車成功' };
}

export async function updateCartItem(
  userUuid: string,
  productId: number,
  quantity: number,
): Promise<ItransportResult<string>> {
  if (quantity <= 0) {
    return { success: false, statusCode: 400, message: '數量必須大於 0' };
  }

  const userId = await getUserIdByUuid(userUuid);
  if (!userId) {
    return { success: false, statusCode: 400, message: '使用者不存在' };
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    return { success: false, statusCode: 500, message: error.message };
  }

  return { success: true, statusCode: 200, message: '購物車商品數量已更新' };
}

export async function deleteCartItem(
  userUuid: string,
  productId: number,
): Promise<ItransportResult<string>> {
  const userId = await getUserIdByUuid(userUuid);
  if (!userId) {
    return { success: false, statusCode: 400, message: '使用者不存在' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    return { success: false, statusCode: 500, message: error.message };
  }

  return { success: true, statusCode: 200, message: '已從購物車移除商品' };
}
