// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 手動解析 .env 文件的函數
// function parseEnvFile(filePath: string): Record<string, string> {
//   try {
//     const envContent = fs.readFileSync(filePath, 'utf-8');
//     const envVars: Record<string, string> = {};

//     envContent.split('\n').forEach((line) => {
//       // 忽略空行和註釋
//       line = line.trim();
//       if (line && !line.startsWith('#')) {
//         const [key, value] = line.split('=').map((part) => part.trim());

//         // 去除可能存在的引號
//         const cleanedValue = value ? value.replace(/^['"]|['"]$/g, '') : '';

//         // 確保 key 和 cleanedValue 都有效
//         if (key && cleanedValue !== undefined) {
//           envVars[key] = cleanedValue;
//         }
//       }
//     });

//     return envVars;
//   } catch (error) {
//     console.error(`Failed to read .env file at ${filePath}:`, error);
//     return {};
//   }
// }

// // 根據 NODE_ENV 動態決定環境變數來源
// //const isProduction = process.env.NODE_ENV === 'production';

// // 在 development 環境中讀取 .env 文件
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const envVars = parseEnvFile(path.resolve(__dirname, '../../.env')) || {};

// // 導出 Vitest 的環境變數配置
export const testEnv = {
  NODE_ENV: 'test',
  HTTPPORT: '3000',
  HTTPSPORT: '443',
  MYSQLHOST: 'TradePlatform-mysql',
  MYSQLHOST_TEST: 'localhost',
  MYSQLUID: 'root',
  MYSQLPASSWORD: 'tpf',
  MYSQLPORT: '3306',
  MYSQLPORT_TEST: '3307',
  ACCESS_TOKEN_SECRET: 'envVars.ACCESS_TOKEN_SECRET',
  REFRESH_TOKEN_SECRET: 'envVars.REFRESH_TOKEN_SECRET',
  ecpayHashKey: '1234567890abcdef',
  ecpayHashIV: 'abcdef1234567890',
  linepayapi_ChannelID: '2006879614',
  linepayapi_ChannelSecretKey: 'envVars.linepayapi_ChannelSecretKey',
  tradeplatform_Superbase_pw: 'envVars.tradeplatform_Superbase_pw',
  rediscloud_freedb_pw: 'envVars.rediscloud_freedb_pw',
  SUPABASE_KEY: 'envVars.SUPABASE_KEY',
  SUPABASE_DB_PW: 'envVars.SUPABASE_DB_PW',
  SUPABASE_URL: 'envVars.SUPABASE_URL',
  pgSQLHOST: 'envars.pgSQLHOST',
  pgUser: 'envVars.pgUser',
  pgPASSWORD: 'evnVars.pgPASSWORD',
};

// export const testEnv = isProduction
//   ? {
//       NODE_ENV: process.env.NODE_ENV,
//       HTTPPORT: process.env.HTTPPORT,
//       HTTPSPORT: process.env.HTTPSPORT,
//       MYSQLHOST: process.env.MYSQLHOST,
//       MYSQLHOST_TEST: process.env.MYSQLHOST_TEST,
//       MYSQLUID: process.env.MYSQLUID,
//       MYSQLPASSWORD: process.env.MYSQLPASSWORD,
//       MYSQLPORT: process.env.MYSQLPORT,
//       MYSQLPORT_TEST: process.env.MYSQLPORT_TEST,
//       ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
//       REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
//       ecpayHashKey: process.env.ecpayHashKey,
//       ecpayHashIV: process.env.ecpayHashIV,
//       linepayapi_ChannelID: process.env.linepayapi_ChannelID,
//       linepayapi_ChannelSecretKey: process.env.linepayapi_ChannelSecretKey,
//       tradeplatform_Superbase_pw: process.env.tradeplatform_Superbase_pw,
//       rediscloud_freedb_pw: process.env.rediscloud_freedb_pw,
//     }
//   : {
//       NODE_ENV: 'development',
//       HTTPPORT: envVars.HTTPPORT,
//       HTTPSPORT: envVars.HTTPSPORT,
//       MYSQLHOST: envVars.MYSQLHOST,
//       MYSQLHOST_TEST: envVars.MYSQLHOST_TEST,
//       MYSQLUID: envVars.MYSQLUID,
//       MYSQLPASSWORD: envVars.MYSQLPASSWORD,
//       MYSQLPORT: envVars.MYSQLPORT,
//       MYSQLPORT_TEST: envVars.MYSQLPORT_TEST,
//       ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
//       REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
//       ecpayHashKey: envVars.ecpayHashKey,
//       ecpayHashIV: envVars.ecpayHashIV,
//       linepayapi_ChannelID: envVars.linepayapi_ChannelID,
//       linepayapi_ChannelSecretKey: envVars.linepayapi_ChannelSecretKey,
//       tradeplatform_Superbase_pw: envVars.tradeplatform_Superbase_pw,
//       rediscloud_freedb_pw: envVars.rediscloud_freedb_pw,
//     };
