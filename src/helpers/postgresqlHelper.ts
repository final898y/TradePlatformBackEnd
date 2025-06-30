import { Pool } from 'pg';
import env from '../configs/env.js';

const pgSQLpool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  user: 'postgres.mcvqgvjxfhohqrhwzkyq',
  password: env.SUPABASE_DB_PW,
  database: 'postgres',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

export default pgSQLpool;
