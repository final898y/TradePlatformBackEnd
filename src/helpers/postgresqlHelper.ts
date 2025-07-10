import { Pool } from 'pg';
import env from '../configs/env.js';

const pgSQLpool = new Pool({
  host: env.pgSQLHOST,
  user: env.pgUser,
  password: env.pgPASSWORD,
  database: 'postgres',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

export default pgSQLpool;
