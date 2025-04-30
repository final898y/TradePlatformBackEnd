import { Request, Response, NextFunction } from 'express';
import * as JwtHelper from '../helpers/jwtHelper.js';
import * as redisHelper from '../helpers/redisHelper.js';
import env from '../configs/env.js';

const jwtKey = env.ACCESS_TOKEN_SECRET;

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    // 檢查 Authorization 格式
    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).send('Invalid token format');
    }

    const token: string = parts[1];

    try {
      // 驗證 JWT 並查詢 Redis 是否存在該 token
      const verifyJwtResult = await JwtHelper.verifyJwt(token, jwtKey);

      if (verifyJwtResult.data) {
        const checkJwtExistResult = await redisHelper.getData(verifyJwtResult.data);

        if (checkJwtExistResult.success) {
          next();
        } else {
          return res.status(401).send('Invalid token');
        }
      } else {
        return res.status(401).send('Invalid token');
      }
    } catch (error) {
      console.error(error); // 記錄錯誤
      return res.status(500).send('Internal server error');
    }
  } else {
    return res.status(401).send('Access denied');
  }
}

export default authenticateToken;
