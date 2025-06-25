import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as productRepository from '../repositorys/productRepository.js';
import * as productService from '../services/productServices.js';

export const getProductsCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await productRepository.getProductsCategories();
    res.status(transportResult.statusCode).json(transportResult.data);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法取得商品類別。'));
    }
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await productService.getAllProducts(req);
    res.status(transportResult.statusCode).json(transportResult.data);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法取得商品資料。'));
    }
  }
};

export const getProductByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportResult = await productService.getProductByID(req);
    res.status(transportResult.statusCode).json(transportResult.data);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法建立 CSRF Token，請稍後再試。'));
    }
  }
};
