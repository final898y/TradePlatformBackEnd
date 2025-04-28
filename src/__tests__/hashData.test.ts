import { describe, it, expect } from 'vitest';
import { Hashdata, ValidateHash } from '@/utility/hashData.js';

describe('bcrypt hashing functions', () => {
  const plainPassword = 'mySecret123';

  it('should hash a password and return a string', async () => {
    const hashed = await Hashdata(plainPassword);
    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(plainPassword);
    expect(hashed.length).toBeGreaterThan(0);
  });

  it('should validate a correct password with the hash', async () => {
    const hashed = await Hashdata(plainPassword);
    const result = await ValidateHash(plainPassword, hashed);
    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const hashed = await Hashdata(plainPassword);
    const result = await ValidateHash('wrongPassword', hashed);
    expect(result).toBe(false);
  });

  it('should handle invalid hash format gracefully', async () => {
    const result = await ValidateHash(plainPassword, 'invalid-hash-data');
    expect(result).toBe(false);
  });
});
