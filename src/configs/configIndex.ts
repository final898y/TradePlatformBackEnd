import env from './env.js';

// const env = process.env.NODE_ENV || 'development';

let config;

if (env.NODE_ENV === 'production') {
  config = await import('./config.production.js');
} else {
  config = await import('./config.development.js');
}

export default config.default;
