import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import env from '../configs/env.js';
import express, { Request, Response } from 'express';
import { SelectQuery, InsertQuery, UpdateQuery } from '../helpers/mysqlHelper.js';
import {
  ValidateRegisterData,
  ValidateUserData,
  ValidatePartialUserData,
} from '../utility/validateData.js';
import generateID from '../utility/IDGenerater.js';
import * as errorHandling from '../utility/errorHandling.js';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from '../model/supabaseModel.js';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import * as supaBaseHelper from '../helpers/supaBaseHelper.js';
import * as redisHelper from '../helpers/redisHelper.js';

const pool = mysql.createPool({
  host: env.MYSQLHOST_TEST,
  user: env.MYSQLUID,
  password: env.MYSQLPASSWORD,
  port: env.MYSQLPORT_TEST,
  database: 'TradePlatform',
  rowsAsArray: true,
});

const testZOD = async (req: Request, res: Response): Promise<void> => {
  const validateResult = await ValidateRegisterData(req);
  if (typeof validateResult === 'string') {
    res.status(400).json(validateResult);
  } else {
    res.status(200).json(validateResult);
  }
};

const testMysqlSelectAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const [results, fields] = await pool.query<RowDataPacket[]>('SELECT * FROM User');
    //const userDetailArray:object[] = results;
    res.status(200).json(results);
  } catch (error) {
    throw error;
  }
};

const testMysqlSelect = async (req: Request, res: Response): Promise<void> => {
  const MobilePhone = req.query.MobilePhone as string;
  try {
    const results = await SelectQuery('User', ['MobilePhone'], [MobilePhone]);
    if (results === undefined) {
      res.status(400).json('錯誤');
    } else {
      const a = results[0];
      const validateResult = await ValidateUserData(a);
      if (typeof validateResult === 'string') {
        res.status(400).json(validateResult);
      } else {
        res.status(200).json(validateResult.Name);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      const sqlErr = err as errorHandling.MySqlError;
      errorHandling.logSqlError(sqlErr);
      throw sqlErr;
    }
  }
};

const testMysqlInsert = async (req: Request, res: Response): Promise<void> => {
  const validateResult = await ValidateRegisterData(req);
  if (typeof validateResult === 'string') {
    res.status(400).json(validateResult);
  } else {
    try {
      // const results = await pool.query<ResultSetHeader>(`
      //   INSERT INTO User
      //   (
      //     UID, Name, MobilePhone, Email, Password,
      //     Birthday, Address, StoreName
      //   )
      //   VALUES
      //   (
      //     "testUID3", "testName", "0981646000", "testEmail", "testPassword",
      //     "1994-04-16", "testAddress", "testStoreName"
      //   )
      // `);
      const insertField = [
        'UID',
        'Name',
        'MobilePhone',
        'Email',
        'Password',
        'Birthday',
        'Address',
        'StoreName',
      ];
      const uid = generateID('UID');
      const insertValue = [
        uid,
        validateResult.Name,
        validateResult.MobilePhone,
        validateResult.Email,
        validateResult.Password,
        validateResult.Birthday,
        validateResult.Address,
        validateResult.StoreName,
      ];
      const result = await InsertQuery('User', insertValue, insertField);
      if (result.affectedRows === 1) {
        res.status(200).json('註冊成功');
      }
    } catch (error) {
      throw error;
    }
  }
};

const testMysqlUpdate = async (req: Request, res: Response): Promise<void> => {
  const validateResult = await ValidatePartialUserData(req);
  if (typeof validateResult === 'string') {
    res.status(400).json(validateResult);
  } else {
    try {
      const updateField = ['Name', 'MobilePhone', 'Email', 'BirthDay', 'Address', 'StoreName'];

      const uid = 'UID2024080817555212345678';
      const updateAndFilterValue = [
        validateResult.Name,
        validateResult.MobilePhone,
        validateResult.Email,
        validateResult.Birthday,
        validateResult.Address,
        validateResult.StoreName,
        uid,
      ];
      const definedProperties: string[] = (
        Object.keys(validateResult) as (keyof typeof validateResult)[]
      ).filter((key) => validateResult[key] !== undefined);
      res.status(200).json(definedProperties);
      // const results = await UpdateQuery('User', updateField, updateAndFilterValue,'UID');
      // if (results.affectedRows === 1) {
      //   res.status(200).json('成功');
      // }
      // else{
      //   res.status(400).json(results)
      // }
    } catch (error) {
      throw error;
    }
  }
};

const testcheckValue = async (req: Request, res: Response): Promise<void> => {
  const params = {
    TradeDesc: '促銷方案',
    PaymentType: 'aio',
    MerchantTradeDate: '2023/03/12 15:30:23',
    MerchantTradeNo: 'ecpay20230312153023',
    MerchantID: '3002607',
    ReturnURL: 'https://www.ecpay.com.tw/receive.php',
    ItemName: 'Apple iphone 15',
    TotalAmount: 30000,
    ChoosePayment: 'ALL',
    EncryptType: 1,
  };

  try {
    const sortedEcPayData = Object.fromEntries(
      Object.entries(params).sort(([keyA], [keyB]) =>
        compareFn(keyA.toLowerCase(), keyB.toLowerCase()),
      ),
    );
    // const sortedEcPayData = Object.fromEntries(
    //   Object.entries(params).sort(([keyA], [keyB]) =>
    //     keyA.toLowerCase().localeCompare(keyB.toLowerCase()),
    //   ),
    // );
    // 2. 將參數串成 key=value&key=value 的格式
    const dataString = Object.entries(sortedEcPayData)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    // 3. 在最前面加上 HashKey，最後面加上 HashIV
    const rawString = `HashKey=${env.ecpayHashKey}&${dataString}&HashIV=${env.ecpayHashIV}`;
    // 4. 進行 URL encode，並轉小寫
    let urlEncodedString = encodeURIComponent(rawString).toLowerCase();

    // 5. 特殊字符處理
    urlEncodedString = urlEncodedString
      .replace(/\'/g, '%27')
      .replace(/\~/g, '%7e')
      .replace(/\%20/g, '+');

    // 6. 使用 SHA256 產生雜湊值，並轉大寫
    let result = crypto.createHash('sha256').update(urlEncodedString).digest('hex').toUpperCase();
    res.status(200).send(result);
  } catch (error) {
    throw error;
  }
};
function compareFn(keyA: string, keyB: string) {
  const len = Math.min(keyA.length, keyB.length);
  for (let i = 0; i < len; i++) {
    if (keyA[i] < keyB[i]) return -1; // 字母依序比較
    if (keyA[i] > keyB[i]) return 1;
  }
  return keyA.length - keyB.length; // 若字母相同，短的在前
}

type users = Tables<'users'>;

type QueryResult<T> = { success: true; data: T[] } | { success: false; error: string };

async function queryUsers<T>(selectcolumn: string, filterValue: string): Promise<QueryResult<T>> {
  // Create a single supabase client for interacting with your database
  const SUPABASE_URL = 'https://mcvqgvjxfhohqrhwzkyq.supabase.co';
  const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdnFndmp4ZmhvaHFyaHd6a3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDA3NDEsImV4cCI6MjA2MDQ3Njc0MX0.ilKmeMYh_1BUcKPNBihSCeCgmEEsLPiAyTGPMaHizpQ';

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from('users')
    .select(selectcolumn)
    .eq(selectcolumn, filterValue);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as T[] };
}

const testSupabaseSelect = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.query.email as string;
    const result = await queryUsers<{ email: string }>('email', email);

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(400).json(result.error);
    }
  } catch (err) {
    throw err;
  }
};

const testSupabaseSelect2 = async (req: Request, res: Response): Promise<void> => {
  try {
    const googleid = req.query.googleid as string;
    const { data, error } = await supaBaseHelper.supabase
      .from('auth_providers') // 替換成你的資料表名稱
      .select('id') // 只查 id 就好，效率較高
      .eq('provider', 'google')
      .eq('provider_user_id', googleid)
      .limit(1); // 只要一筆結果就好，提早終止查詢
    if (error) {
      console.error('查詢錯誤：', error.message);
    }
    if (data) {
      res.status(200).json(data[0]);
    } else {
      res.status(400).json(data);
    }
  } catch (err) {
    throw err;
  }
};

const testJWTpayload = async (req: Request, res: Response): Promise<void> => {
  const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
  const credential =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzZjdhMzU4Mzc5NmY5NzEyOWU1NDE4ZjliMjEzNmZjYzBhOTY0NjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNTkyMDA1MzM2ODctODdsYWgwc3U2dWZ2aDM0Z2kxYzE0bXQwc3VkcnBwMjEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNTkyMDA1MzM2ODctODdsYWgwc3U2dWZ2aDM0Z2kxYzE0bXQwc3VkcnBwMjEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMzNTAzMzM5NjcxODk3MDEyMjkiLCJlbWFpbCI6ImpwYWNnODk4eUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzQ1NDI3NDM3LCJuYW1lIjoiQWxhbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJMGVQeEZObG4xV05GZ0FLcFBnd1pIUWlxVkc3MjNPT29pdkpWNElzbmNWM3A4R2gySj1zOTYtYyIsImdpdmVuX25hbWUiOiJBbGFuIiwiaWF0IjoxNzQ1NDI3NzM3LCJleHAiOjE3NDU0MzEzMzcsImp0aSI6IjA2MDhjN2ExOTE0M2M4MWRhOGUxYjkyYTVkMWI3ZDBlOTIwNzEyNTgifQ.Lt5BCX-Uii8jBnLexWMX3-m3KiWtI17Ehd-sJEORpdasKKfBg5bJaOC77U9NRToe21m2UNZYtBOYVbQh1Ogb1hGa0W6U0_7GTPq7vJ1Zc_SIt3j1FcZgtoVZjRNxKp_9AJBT2Af4wLwzYA8JkTao5HjzKoUpKTVd5JxfxpbdTJfcOxQ-VUH5AL-FrQPWp65Up-wgJ9rwMIPULtjCUDpJtmUVC9o4EllBRuu6XpZcbsvhS3IjhrLaiHpgylyhMHJbX-ZusQbGxXMmfNC3-9adDeHkwJ0IDaHoqM1PPcWy7MO9e6yHE1gYuPBZgEQQaog9naxo3z_6oxvEM0F80iWjRA';
  const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
    issuer: 'https://accounts.google.com',
    audience: '359200533687-87lah0su6ufvh34gi1c14mt0sudrpp21.apps.googleusercontent.com', // ← 替換成你自己的 Client ID
  });
  res.status(200).json(payload);
};

const testRedisSet = async (req: Request, res: Response): Promise<void> => {
  try {
    await redisHelper.setData('testRedisset', 'token');
    res.status(200).json('ok');
  } catch (err) {
    throw err;
  }
};

const router = express.Router();
router.get('/selectall', testMysqlSelectAll);
router.get('/select', testMysqlSelect);
router.post('/insert', testMysqlInsert);
router.get('/zod', testZOD);
router.put('/edit', testMysqlUpdate);
router.get('/ck', testcheckValue);
router.get('/supabase', testSupabaseSelect);
router.get('/testjwtpayload', testJWTpayload);
router.get('/supabase2', testSupabaseSelect2);
router.get('/testRedisSet', testRedisSet);

export default router;
