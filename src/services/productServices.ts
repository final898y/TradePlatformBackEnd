import * as productRepository from '../repositorys/productRepository.js';
import ItransportResult from '../model/transportModel.js';
import { Request } from 'express';
import * as productModel from '../model/productModel.js';

export const getAllProducts = async (
  req: Request,
): Promise<ItransportResult<productModel.ProductListResponse>> => {
  try {
    // 查詢所有分類
    const queryParseresult = productModel.querySchema.safeParse(req.query);
    if (!queryParseresult.success) {
      return {
        success: false,
        statusCode: 500,
        message: `query Parse Error`,
      };
    }
    const results = await productRepository.getAllProducts(queryParseresult.data);
    if (!results.success) {
      return {
        success: false,
        statusCode: 500,
        message: `Database Query Error`,
      };
    }
    if (!results.data) {
      return {
        success: false,
        statusCode: 500,
        message: `Database Query Not Found`,
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Get ProductList',
      data: results.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getProductByID = async (
  req: Request,
): Promise<ItransportResult<productModel.ProductDetailResponse>> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return {
        success: false,
        statusCode: 400,
        message: `無效的商品 ID`,
      };
    }
    const results = await productRepository.getProductByID(id);
    if (!results.success) {
      return {
        success: false,
        statusCode: 500,
        message: `Database Query Error`,
      };
    }
    if (!results.data) {
      return {
        success: false,
        statusCode: 500,
        message: `商品不存在`,
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Get Product Detail',
      data: results.data,
    };
  } catch (error) {
    throw error;
  }
};
