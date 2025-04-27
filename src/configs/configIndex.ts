const env = process.env.NODE_ENV || 'development';

let configPath = `./config.${env}.js`;

let config;
try {
  config = await import(configPath);
} catch (error) {
  console.error(`Failed to load config for ${env}:`, error);
  config = await import('./config.development.js');
}

// config 是一個 module object，要取 default export
export default config.default;
