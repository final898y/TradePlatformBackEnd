import express from 'express';
import * as redisHelper from '../helpers/redisHelper.js';
import * as supabaseHelper from '../helpers/supaBaseHelper.js';
import { Request, Response } from 'express';
const router = express.Router();

let healthCache = {
  redis: { status: false, timestamp: 0 },
  supabase: { status: false, timestamp: 0 },
};

//快取有效時間：一天（24 小時）
const CACHE_TTL = 24 * 60 * 60 * 1000; // = 86400000 毫秒

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_TTL;
};

const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const healthStatus = {
    server: 'online',
    redis: 'pending',
    supabase: 'pending',
  };

  try {
    if (!healthCache.redis.status || !isCacheValid(healthCache.redis.timestamp)) {
      await redisHelper.client.ping();
      healthStatus.redis = 'online';
      healthCache.redis = {
        status: true,
        timestamp: Date.now(),
      };
    } else {
      healthStatus.redis = 'online';
    }

    if (!healthCache.supabase.status || !isCacheValid(healthCache.supabase.timestamp)) {
      const { data, error } = await supabaseHelper.supabase.from('users').select('*').limit(1);
      if (error) throw new Error('Supabase check failed');
      healthStatus.supabase = 'online';
      healthCache.supabase = {
        status: true,
        timestamp: Date.now(),
      };
    } else {
      healthStatus.supabase = 'online';
    }

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    // Update status for failed checks
    if (!healthCache.redis) healthStatus.redis = 'offline';
    if (!healthCache.supabase) healthStatus.supabase = 'offline';
    res.status(503).json(healthStatus);
  }
};

router.get('/check', healthCheck);

export default router;
