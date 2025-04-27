import { configDefaults, defineConfig } from 'vitest/config';
import { testEnv } from './src/configs/vitestEnvConfig.ts'; // 調整路徑根據實際文件位置

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '**/build/**'],
    env: testEnv,
    environment: 'node',
  },
});
