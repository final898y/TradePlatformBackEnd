import { Request, Response, NextFunction } from 'express';
import * as JwtHelper from '../helpers/jwtHelper.js';
import env from '../configs/env.js';

const jwtKey = env.ACCESS_TOKEN_SECRET;

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const token: string = req.headers.authorization.split(' ')[1];
    if (await JwtHelper.verifyJwt(token, jwtKey)) {
      next();
    } else {
      return res.status(403).send('Invalid token');
    }
  } else {
    return res.status(401).send('Access denied');
  }
}
export default authenticateToken;
