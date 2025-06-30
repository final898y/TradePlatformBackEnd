import crypto from 'crypto';

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20250629

  // 使用 crypto 隨機產生 4 byte（8 個 hex 字元）
  const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase(); // 例如：3F8A12C7

  return `ORD${datePart}-${randomBytes}`;
}
