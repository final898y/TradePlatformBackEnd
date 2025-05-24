import { describe, it, expect } from 'vitest';

describe('Environment Variables', () => {
  it('should have correct environment variables in development', () => {
    // 在 development 環境中，預期 VITE_API_URL 從 .env 文件加載
    if (process.env.NODE_ENV === 'development') {
      expect(process.env.NODE_ENV).toBe('development');
      expect(process.env.MYSQLPASSWORD).toBe('tpf');
    }
  });

  it('should have correct environment variables in production', () => {
    if (process.env.NODE_ENV === 'production') {
      expect(process.env.NODE_ENV).toBe('production');
      expect(process.env.MYSQLPASSWORD).toBe('tpf'); //
    }
  });
});
