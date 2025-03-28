import { Request, Response,NextFunction} from 'express';
import * as JwtHelper from '../helpers/jwtHelper.js'

async function authenticateToken(req:Request, res:Response, next:NextFunction) {
    if(req.headers.authorization){
        const token : string= req.headers.authorization.split(' ')[1];
        if(await JwtHelper.verifyJwt(token)){
            next();
        }
        else{
            return res.status(403).send('Invalid token');
        }
    }else{
      return res.status(401).send('Access denied');
    }
  }
export default authenticateToken;