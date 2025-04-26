import { createClient } from 'redis';
import env from '../configs/env.js';
import config from '../configs/configIndex.js';
import ItransportResult from '../model/transportModel.js';

const client = createClient({
  username: config.redisconfig.username,
  password: env.rediscloud_freedb_pw,
  socket: {
    host: config.redisconfig.host,
    port: config.redisconfig.port,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('reconnecting', () => console.log('Redis reconnecting...'));
client.on('ready', () => console.log('Redis connected!'));

// 確保連線只初始化一次
async function initializeRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// 在模組載入時初始化連線
initializeRedis().catch((err) => console.error('Redis initialization failed:', err));

async function setData(key: string, value: string, ttlSeconds: number = 3600) {
  try {
    await initializeRedis();
    await client.set(key, value, { EX: ttlSeconds }); // 設置 1 小時過期
  } catch (err) {
    console.error('Set data error:', err);
    throw err;
  }
}

async function getData(key: string): Promise<ItransportResult<string>> {
  try {
    await initializeRedis(); // 確保連線
    const retrievedValue = await client.get(key);
    if (retrievedValue !== null) {
      return { success: true, statusCode: 200, message: 'Get data OK', data: retrievedValue };
    }
    return { success: false, statusCode: 404, message: 'Not found.' };
  } catch (err) {
    throw err;
  }
}

// 應用關閉時斷開連線
process.on('SIGTERM', async () => {
  await client.quit();
  console.log('Redis connection closed.');
});

export { setData, getData };
