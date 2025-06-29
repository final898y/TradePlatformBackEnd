import { describe, it, expect } from 'vitest';
import { generateMerchantTradeNo, GetCheckMacValue } from '../../helpers/ecpayHelper.js';
import crypto from 'node:crypto';

function createMockCheckoutList(overrides: Partial<Record<string, string>> = {}) {
  return {
    MerchantID: '2000132',
    MerchantTradeNo: generateMerchantTradeNo(),
    MerchantTradeDate: '2025/06/29 12:00:00',
    PaymentType: 'aio',
    TotalAmount: '1000',
    TradeDesc: '測試交易',
    ItemName: '商品A#商品B',
    ReturnURL: 'https://example.com/callback',
    ChoosePayment: 'ALL',
    ...overrides,
  };
}

describe('GetCheckMacValue', () => {
  it('應該正確產出對應的 SHA256 CheckMacValue', () => {
    const checkoutList = createMockCheckoutList();
    const hashKey = process.env.ecpayHashKey;
    const hashIV = process.env.ecpayHashIV;

    expect(hashKey).toBeDefined();
    expect(hashIV).toBeDefined();

    const sortedEntries = Object.entries(checkoutList).sort(([a], [b]) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );

    const rawString =
      `HashKey=${hashKey}&` +
      sortedEntries.map(([k, v]) => `${k}=${v}`).join('&') +
      `&HashIV=${hashIV}`;

    const encoded = encodeURIComponent(rawString)
      .toLowerCase()
      .replace(/'/g, '%27')
      .replace(/~/g, '%7e')
      .replace(/%20/g, '+');

    const expected = crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();

    const actual = GetCheckMacValue(checkoutList);
    expect(actual).toBe(expected);
  });
});

describe('generateMerchantTradeNo', () => {
  it('應該產生長度為 20 的字串', () => {
    const tradeNo = generateMerchantTradeNo();
    expect(tradeNo).toHaveLength(20);
  });

  it('應該只包含英數字字元', () => {
    const tradeNo = generateMerchantTradeNo();
    expect(/^[A-Za-z0-9]{20}$/.test(tradeNo)).toBe(true);
  });

  it('應該產生不重複的編號', () => {
    const results = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const tradeNo = generateMerchantTradeNo();
      expect(results.has(tradeNo)).toBe(false);
      results.add(tradeNo);
    }
  });

  it('應該以 14 位數的時間戳字串開頭', () => {
    const tradeNo = generateMerchantTradeNo();
    const timePart = tradeNo.substring(0, 14);
    expect(/^[0-9]{14}$/.test(timePart)).toBe(true);
  });
});
