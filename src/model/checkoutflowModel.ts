import { z } from 'zod';

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
