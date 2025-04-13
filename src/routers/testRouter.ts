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

const router = express.Router();
router.get('/selectall', testMysqlSelectAll);
router.get('/select', testMysqlSelect);
router.post('/insert', testMysqlInsert);
router.get('/zod', testZOD);
router.put('/edit', testMysqlUpdate);
router.get('/ck', testcheckValue);

export default router;
