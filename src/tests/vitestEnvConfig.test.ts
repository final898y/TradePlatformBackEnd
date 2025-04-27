import { describe, it, expect } from 'vitest';

describe('Environment Variables', () => {
  it('should have correct environment variables in development', () => {
    // 在 development 環境中，預期 VITE_API_URL 從 .env 文件加載
    if (process.env.NODE_ENV === 'development') {
      expect(process.env.NODE_ENV).toBe('development');
      expect(process.env.MYSQLPASSWORD).toBe('tpf'); // 假設 .env 中設置為此值
    }
  });

  it('should have correct environment variables in production', () => {
    // 在 production 環境中，預期 VITE_API_URL 從 process.env 獲取
    if (process.env.NODE_ENV === 'production') {
      expect(process.env.NODE_ENV).toBe('production');
      expect(process.env.VITE_API_URL).toBeDefined(); // 確保有值
    }
  });
});
