import type { Server } from 'http';
import type { Server as HttpsServer } from 'https';
import { createClient } from 'redis';

// 支援關閉多個 Server 和 Redis
export async function gracefulShutdown({
  servers = [],
  redisClient = null,
}: {
  servers?: (Server | HttpsServer | undefined)[];
  redisClient?: ReturnType<typeof createClient> | null;
}) {
  console.error('Starting graceful shutdown...');

  // 10秒內沒關好就強制退出
  const forceExitTimeout = setTimeout(() => {
    console.error('Force exiting because shutdown took too long.');
    process.exit(1); // 1 表示異常結束
  }, 10000); // 設定 10秒超時

  try {
    // 關閉所有 server
    for (const server of servers) {
      if (!server) continue; // 如果是 undefined 就跳過

      await closeServer(server); // 關閉 server
    }

    // 關閉 Redis
    if (redisClient && redisClient.isOpen) {
      await closeRedis(redisClient); // 關閉 Redis 連線
    }

    console.error('Graceful shutdown complete.');
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
  } finally {
    // 清除超時計時器
    clearTimeout(forceExitTimeout); // 成功關完記得清除超時計時器
  }
}

// 封裝關閉 server 的邏輯
async function closeServer(server: Server | HttpsServer) {
  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    console.error('Server closed.');
  } catch (err) {
    console.error('Error closing server:', err);
  }
}

// 封裝關閉 Redis 連線的邏輯
async function closeRedis(redisClient: ReturnType<typeof createClient>) {
  try {
    await redisClient.quit();
    console.error('Redis connection closed.');
  } catch (err) {
    console.error('Error closing Redis connection:', err);
  }
}
