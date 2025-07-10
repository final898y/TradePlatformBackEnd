import env from '../configs/env.js';
import crypto from 'crypto';

export function GetCheckMacValue(checkoutList: object): string {
  // 1. 先將參數依照第一個英文字母由 A-Z 排序
  const sortedEcPayData = Object.fromEntries(
    Object.entries(checkoutList).sort(([keyA], [keyB]) =>
      compareFn(keyA.toLowerCase(), keyB.toLowerCase()),
    ),
  );
  // 2. 將參數串成 key=value&key=value 的格式
  const dataString = Object.entries(sortedEcPayData)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  // 3. 在最前面加上 HashKey，最後面加上 HashIV
  const rawString = `HashKey=${env.ecpayHashKey}&${dataString}&HashIV=${env.ecpayHashIV}`;
  // 4. 進行 URL encode，並轉小寫
  let urlEncodedString = encodeURIComponent(rawString).toLowerCase();

  // 5. 特殊字符處理
  urlEncodedString = urlEncodedString
    .replace(/'/g, '%27')
    .replace(/~/g, '%7e')
    .replace(/%20/g, '+');

  // 6. 使用 SHA256 產生雜湊值，並轉大寫
  return crypto.createHash('sha256').update(urlEncodedString).digest('hex').toUpperCase();
}

function compareFn(keyA: string, keyB: string) {
  const len = Math.min(keyA.length, keyB.length);
  for (let i = 0; i < len; i++) {
    if (keyA[i] < keyB[i]) return -1; // 字母依序比較
    if (keyA[i] > keyB[i]) return 1;
  }
  return keyA.length - keyB.length; // 若字母相同，短的在前
}

export function generateMerchantTradeNo(): string {
  // 1. 取得當前時間並格式化為 yyyymmddHHMMss
  const now = new Date();
  const timePart = now
    .toISOString() // e.g. 2025-07-10T14:25:30.000Z
    .replace(/[-T:Z.]/g, '') // 移除不必要符號
    .substring(0, 14); // 取前 14 位 → "20250710142530"

  // 2. 使用 crypto 產生 10 字元亂數（對應 5 bytes）
  const randomPart = crypto.randomBytes(5).toString('hex').toUpperCase(); // 5 bytes → 10 hex 字元

  // 3. 合併時間與亂數，共 20 字元
  return timePart + randomPart.slice(0, 6); // 保留原來6碼長度
}
