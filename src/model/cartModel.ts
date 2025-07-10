import { z } from 'zod';

export const AddToCartSchema = z.object({
  userUuid: z.string().uuid(),
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

export type AddToCartRequest = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  userUuid: z.string().uuid(),
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

//export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemSchema>;

export const DeleteCartItemSchema = z.object({
  productId: z.string().regex(/^\d+$/), // 字串型數字
  userUuid: z.string().uuid(),
});

//export type DeleteCartItemRequest = z.infer<typeof DeleteCartItemSchema>;

export const ClearCartSchema = z.object({
  userUuid: z.string().uuid(),
});

export const GetCartSchema = z.object({
  userUuid: z.string().uuid(),
});

const productSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.string().nullable(),
  is_published: z.boolean(),
  is_deleted: z.boolean(),
  created_at: z.string().nullable(), // 通常為 ISO 字串
  updated_at: z.string().nullable(),
});

const cartItemSchema = z.object({
  quantity: z.number().min(1), // 對應 CHECK (quantity > 0)
  products: productSchema,
});

const cartItemListSchema = z.array(cartItemSchema); // 陣列形式
export type cartItemListResponse = z.infer<typeof cartItemListSchema>;
