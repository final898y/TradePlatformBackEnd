import type { Config } from '../types/configType.js';

const env = process.env.NODE_ENV || 'development';
let configPath = `./config.${env}.js`;
let rawConfigModule: { default: Config };

try {
  rawConfigModule = await import(configPath);
} catch (error) {
  console.error(`Failed to load config for ${env}:`, error);
  rawConfigModule = await import('./config.development.js');
}

const config: Config = rawConfigModule.default;

// config 是一個 module object，要取 default export
export default config;
