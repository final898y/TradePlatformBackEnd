import { z } from 'zod';

// 使用 Zod 定義你的環境變數 schema
const envSchema = z.object({
  HTTPPORT: z.preprocess((val) => Number(val), z.number().int().default(3000)),
  HTTPSPORT: z.preprocess((val) => Number(val), z.number().int().default(443)),
  // Node環境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // MySQL 連線設定
  MYSQLHOST: z.string(),
  MYSQLHOST_TEST: z.string(),
  MYSQLUID: z.string(),
  MYSQLPASSWORD: z.string(),
  MYSQLPORT: z.string().transform(Number),
  MYSQLPORT_TEST: z.string().transform(Number),

  // Token 秘密金鑰
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // 第三方服務金鑰
  ecpayHashKey: z.string(),
  ecpayHashIV: z.string(),
  linepayapi_ChannelID: z.string(),
  linepayapi_ChannelSecretKey: z.string(),

  // Redis
  rediscloud_freedb_pw: z.string(),
  //Supabase
  SUPABASE_KEY: z.string(),
});

// 2. 解析並驗證環境變數
const _env = envSchema.safeParse(process.env);

// 3. 如果驗證失敗，直接報錯退出
if (!_env.success) {
  console.error('❌ 環境變數驗證失敗:', _env.error.flatten().fieldErrors);
  throw new Error('⚠️ 請檢查你的環境變數設定！');
}

// 4. 匯出解析後的環境變數
const env = _env.data;

export default env;
