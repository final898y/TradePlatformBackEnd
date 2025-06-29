import { describe, it, expect } from 'vitest';

describe('Environment Variables', () => {
  it('should have correct environment variables in development', () => {
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
