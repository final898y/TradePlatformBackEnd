import * as cartRepository from '../repositorys/cartRepository.js';
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
    return await cartRepository.addToCart(userUuid, productId, quantity);
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
    return await cartRepository.updateCartItem(userUuid, productId, quantity);
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (req: Request): Promise<ItransportResult<string>> => {
  try {
    const parseresult = cartModel.DeleteCartItemSchema.safeParse(req.body);
    if (!parseresult.success) {
      return {
        success: false,
        statusCode: 500,
        message: `Request Body Parse Error`,
      };
    }
    const { userUuid, productId } = parseresult.data;
    return await cartRepository.deleteCartItem(userUuid, productId);
  } catch (error) {
    throw error;
  }
};
