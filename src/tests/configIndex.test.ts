// configIndex.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('configIndex', () => {
  const originalEnv = process.env.NODE_ENV; // 保存原本的環境變數

  beforeEach(() => {
    vi.resetModules(); // 重置 module cache，確保每次測試都重新載入
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv; // 測試後還原環境變數
  });

  it('should load production config when NODE_ENV is production', async () => {
    process.env.NODE_ENV = 'production';
    const config = (await import('../configs/configIndex.js')).default;

    expect(config.linepayredirectUrls.confirmUrl).toBe(
      'https://shopping-web-grok.vercel.app/linepay/confirm',
    );
    expect(config.linepayredirectUrls.cancelUrl).toBe(
      'https://shopping-web-grok.vercel.app/linepay/cancel',
    );

    expect(config.allowedOrigins).toContain('https://shopping-web-grok.vercel.app');
    expect(config.redisconfig.port).toBe(15546);
  });

  it('should load development config when NODE_ENV is not production', async () => {
    process.env.NODE_ENV = 'development';
    const config = (await import('../configs/configIndex.js')).default;

    expect(config.linepayredirectUrls.confirmUrl).toBe('http://localhost:5173/linepay/confirm');
    expect(config.linepayredirectUrls.cancelUrl).toBe('http://localhost:5173/linepay/cancel');

    expect(config.allowedOrigins).toContain('http://localhost:3000');
    expect(config.redisconfig.port).toBe(15546);
  });
  it('should load development config when NODE_ENV is undefined', async () => {
    process.env.NODE_ENV = undefined; // 模擬 NODE_ENV 為 undefined
    const config = (await import('../configs/configIndex.js')).default;

    expect(config.linepayredirectUrls.confirmUrl).toBe('http://localhost:5173/linepay/confirm');
    expect(config.linepayredirectUrls.cancelUrl).toBe('http://localhost:5173/linepay/cancel');

    expect(config.allowedOrigins).toContain('http://localhost:3000');
    expect(config.redisconfig.port).toBe(15546);
  });
});
