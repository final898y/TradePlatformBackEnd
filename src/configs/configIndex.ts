import type { Config } from '../types/configType.js';

const env = process.env.NODE_ENV || 'development';

let rawConfigModule: { default: Config };

switch (env) {
  case 'production':
    rawConfigModule = await import('./config.production.js');
    break;
  case 'development':
    rawConfigModule = await import('./config.development.js');
    break;
  default:
    console.warn(`Unknown NODE_ENV "${env}", falling back to development config.`);
    rawConfigModule = await import('./config.development.js');
    break;
}

const config: Config = rawConfigModule.default;
export default config;
