import { configDefaults, defineConfig } from 'vitest/config';
import { testEnv } from './src/configs/vitestEnvConfig.ts'; // 調整路徑根據實際文件位置
import { fileURLToPath } from 'url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, '**/build/**', '**/public/**'],
    env: testEnv,
    environment: 'node',
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
