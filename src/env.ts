import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// 使用 Zod 定義你的環境變數 schema
const envSchema = z.object({
  HTTPPORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  HTTPSPORT: z
  .string()
  .transform((val) => parseInt(val, 10))
  .default('443'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MYSQLHOST: z.string(),
  MYSQLHOST_TEST: z.string(),
  MYSQLUID: z.string(),
  MYSQLPASSWORD: z.string(),
  MYSQLPORT: z.string().transform((val) => parseInt(val, 10)),
  MYSQLPORT_TEST: z.string().transform((val) => parseInt(val, 10)),
  JWTKEY: z.string(),
  ecpayHashKey: z.string(),
  ecpayHashIV: z.string(),
});

// 驗證並解析環境變數
const env = envSchema.parse(process.env);

export default env;
