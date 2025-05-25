import express from 'express';
import * as redisHelper from '../helpers/redisHelper.js';
import * as supabaseHelper from '../helpers/supaBaseHelper.js';
import { Request, Response } from 'express';
const router = express.Router();

let healthCache = {
  redis: false,
  supabase: false,
};

const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const healthStatus = {
    server: 'online',
    redis: 'pending',
    supabase: 'pending',
  };

  try {
    if (!healthCache.redis) {
      await redisHelper.client.ping();
      healthStatus.redis = 'online';
      healthCache.redis = true;
    } else {
      healthStatus.redis = 'online';
    }

    if (!healthCache.supabase) {
      const { data, error } = await supabaseHelper.supabase.from('users').select('*').limit(1);
      if (error) throw new Error('Supabase check failed');
      healthStatus.supabase = 'online';
      healthCache.supabase = true;
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
