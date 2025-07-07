import { z } from 'zod';
import { TablesUpdate } from '../model/supabaseModel.js';

export const checkoutRequestSchema = z.object({
  userUuid: z.string().uuid({ message: 'userUuid 必須是合法的 UUID 格式' }),
  shipping_address: z.string(),
  order_note: z.string().optional(),
  recipient_name: z.string().min(2, { message: '收件人姓名不能太短' }),
  recipient_phone: z
    .string()
    .regex(/^09\d{8}$/, { message: '手機號碼格式錯誤，需為 09 開頭的 10 位數字' }),
  recipient_email: z.string().email({ message: 'Email 格式錯誤' }),
  payment_method: z.enum(['ecpay', 'credit_card', 'line_pay'], {
    errorMap: () => ({ message: '付款方式不正確' }),
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const orderItemSchema = z.object({
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
});

export const orderDetailSchema = z.object({
  order_id: z.number(),
  order_number: z.string(),
  total_amount: z.string(), // Assuming total_amount is a string from the DB
  status: z.string(),
  shipping_address: z.string(),
  order_note: z.string().nullable(),
  recipient_name: z.string(),
  recipient_phone: z.string(),
  recipient_email: z.string(),
  payment_method: z.string(),
  created_at: z.date(),
  paid_at: z.date().nullable(),
  items: z.array(orderItemSchema),
});

export type OrderDetail = z.infer<typeof orderDetailSchema>;

export type PaymentUpdate = TablesUpdate<'payments'>;

export enum OrderStatus {
  Pending = 'PENDING',
  Paid = 'PAID',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: string; // Or number, depending on what the driver returns
  stock: number;
}
