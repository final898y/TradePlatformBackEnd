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
  userUuid: z.string().uuid(),
  productId: z.number().int().positive(),
});

//export type DeleteCartItemRequest = z.infer<typeof DeleteCartItemSchema>;
