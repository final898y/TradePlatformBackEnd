import * as cartRepository from '../repositorys/cartRepository.js';
import { getUserIdByUuid } from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';
import { Request } from 'express';
import * as cartModel from '../model/cartModel.js';

export const addToCart = async (req: Request): Promise<ItransportResult<string>> => {
  try {
    const parseresult = cartModel.AddToCartSchema.safeParse(req.body);
    if (!parseresult.success) {
      return {
        success: false,
        statusCode: 500,
        message: `Request Body Parse Error`,
      };
    }
    const { userUuid, productId, quantity } = parseresult.data;
    // 查詢 user_id
    const userId = await getUserIdByUuid(userUuid);
    if (!userId) {
      return { success: false, statusCode: 400, message: '使用者不存在' };
    }
    return await cartRepository.addToCart(userId, productId, quantity);
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (req: Request): Promise<ItransportResult<string>> => {
  try {
    const parseresult = cartModel.UpdateCartItemSchema.safeParse(req.body);
    if (!parseresult.success) {
      return {
        success: false,
        statusCode: 500,
        message: `Request Body Parse Error`,
      };
    }
    const { userUuid, productId, quantity } = parseresult.data;
    const userId = await getUserIdByUuid(userUuid);
    if (!userId) {
      return { success: false, statusCode: 400, message: '使用者不存在' };
    }
    return await cartRepository.updateCartItem(userId, productId, quantity);
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (req: Request): Promise<ItransportResult<string>> => {
  try {
    const { productId } = req.params;
    const { userUuid } = req.query;

    const parseresult = cartModel.DeleteCartItemSchema.safeParse({ productId, userUuid });
    if (!parseresult.success) {
      return {
        success: false,
        statusCode: 400,
        message: '參數驗證失敗',
        // 可加 issues: parsed.error.issues 做更詳細回報
      };
    }
    const userId = await getUserIdByUuid(parseresult.data.userUuid);
    if (!userId) {
      return { success: false, statusCode: 400, message: '使用者不存在' };
    }
    return await cartRepository.deleteCartItem(userId, Number(parseresult.data.productId));
  } catch (error) {
    throw error;
  }
};

export const clearCart = async (req: Request): Promise<ItransportResult<string>> => {
  try {
    const { userUuid } = req.query;

    if (!userUuid || typeof userUuid !== 'string') {
      return {
        success: false,
        statusCode: 400,
        message: '缺少或錯誤的 userUuid',
      };
    }
    const userId = await getUserIdByUuid(userUuid);
    if (!userId) {
      return { success: false, statusCode: 400, message: '使用者不存在' };
    }
    return await cartRepository.clearCart(userId);
  } catch (error) {
    throw error;
  }
};

export const getCart = async (
  req: Request,
): Promise<ItransportResult<cartModel.cartDataSchemaResponse>> => {
  const parseResult = cartModel.GetCartSchema.safeParse(req.query);

  if (!parseResult.success) {
    return {
      success: false,
      statusCode: 400,
      message: '查詢參數錯誤',
    };
  }

  const { userUuid } = parseResult.data;
  const userId = await getUserIdByUuid(userUuid);
  if (!userId) {
    return { success: false, statusCode: 400, message: '使用者不存在' };
  }

  return await cartRepository.getCart(userId);
};
