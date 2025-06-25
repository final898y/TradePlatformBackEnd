import * as supaBaseHelper from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';
import * as productModel from '../model/productModel.js';

const parseNumberParam = (param: string | undefined, defaultValue: number): number => {
  const num = parseInt(param || '');
  return isNaN(num) || num < 1 ? defaultValue : num;
};

export const getProductsCategories = async (): Promise<
  ItransportResult<productModel.CategoryResponse[]>
> => {
  try {
    // 查詢所有分類
    const { data: categories, error: catError } = await supaBaseHelper.supabase
      .from('categories')
      .select('id, name')
      .order('id', { ascending: true });

    if (catError) throw new Error(`查詢分類失敗: ${catError.message}`);

    // 查詢所有子分類
    const { data: subCategories, error: subCatError } = await supaBaseHelper.supabase
      .from('sub_categories')
      .select('id, name, category_id')
      .order('id', { ascending: true });

    if (subCatError) throw new Error(`查詢子分類失敗: ${subCatError.message}`);

    // 組合分類與子分類資料
    const response = categories.map((category) => ({
      id: category.id,
      name: category.name,
      subCategories: subCategories
        .filter((sub) => sub.category_id === category.id)
        .map((sub) => ({ id: sub.id, name: sub.name })),
    }));
    return {
      success: true,
      statusCode: 200,
      message: 'Get Products Categories',
      data: response,
    };
  } catch (e: any) {
    return {
      success: false,
      statusCode: 500,
      message: `unexpected error: ${e.message}`,
    };
  }
};

export const getAllProducts = async (
  queryParam: productModel.queryParam,
): Promise<ItransportResult<productModel.ProductListResponse>> => {
  try {
    // 查詢所有分類
    const { page, pageSize, categoryId, subCategoryId, search } = queryParam;

    // 設定分頁參數（預設值：第1頁，每頁10筆）
    const pageNum = parseNumberParam(page, 1);
    const pageSizeNum = parseNumberParam(pageSize, 10);
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    // 構建 Supabase 查詢
    let query = supaBaseHelper.supabase
      .from('products')
      .select('id, name, price, description, stock, image_url, category_id, sub_category_id')
      .range(from, to) // 分頁
      .order('id', { ascending: true });

    // 篩選條件
    if (categoryId) {
      const catId = parseInt(categoryId);
      if (!isNaN(catId)) query = query.eq('category_id', catId);
    }

    if (subCategoryId) {
      const subCatId = parseInt(subCategoryId);
      if (!isNaN(subCatId)) query = query.eq('sub_category_id', subCatId);
    }

    // 搜尋商品名稱（使用 ilike 進行模糊比對）
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 執行查詢
    const { data: products, error, count } = await query;

    if (error) throw new Error(`查詢商品失敗: ${error.message}`);

    // 格式化回應資料
    const response = {
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description || '',
        stock: product.stock,
        image_url: product.image_url || '',
        categoryId: product.category_id,
        subCategoryId: product.sub_category_id,
      })),
      total: count || 0,
    };
    return {
      success: true,
      statusCode: 200,
      message: 'Get ProductList',
      data: response,
    };
  } catch (e: any) {
    return {
      success: false,
      statusCode: 500,
      message: `unexpected error: ${e.message}`,
    };
  }
};

export const getProductByID = async (
  id: number,
): Promise<ItransportResult<productModel.ProductDetailResponse>> => {
  try {
    const { data: product, error } = await supaBaseHelper.supabase
      .from('products')
      .select('id, name, price, description, stock, image_url, category_id, sub_category_id')
      .eq('id', id)
      .single();
    if (error || !product) {
      return {
        success: false,
        statusCode: 404,
        message: `商品不存在`,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: 'Get Product Detail',
      data: product,
    };
  } catch (e: any) {
    return {
      success: false,
      statusCode: 500,
      message: `unexpected error: ${e.message}`,
    };
  }
};
