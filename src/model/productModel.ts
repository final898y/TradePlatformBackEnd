import { z } from 'zod';

export const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  search: z.string().optional(),
});
export type queryParam = z.infer<typeof querySchema>;

export interface SubCategoryResponse {
  id: number;
  name: string;
}
export interface CategoryResponse {
  id: number;
  name: string;
  subCategories: SubCategoryResponse[];
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  description: string; // 資料庫中為 string | null，API 回應預設為空字串
  stock: number;
  image_url: string; // 資料庫中為 string | null，API 回應預設為空字串
  categoryId: number;
  subCategoryId: number;
}

export interface ProductListResponse {
  data: ProductResponse[];
  total: number;
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  image_url: string | null;
  category_id: number;
  sub_category_id: number;
}
