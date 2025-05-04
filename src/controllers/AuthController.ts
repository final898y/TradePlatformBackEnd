import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as authService from '../services/authService.js';

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies['tpaccessToken'];
    const refreshToken = req.cookies['tprefreshToken'];
    if ((!accessToken && !refreshToken) || (accessToken && !refreshToken)) {
      res.status(500).json({ success: false, message: 'Not have token' });
    }

    const isVerified = await authService.verifyToken(accessToken, refreshToken);
    if (isVerified.success === false || !isVerified.data) {
      res.status(isVerified.statusCode).json({ success: false, message: isVerified.message });
    } else {
      if (isVerified.message === 'new accessToken') {
        res.cookie('tpaccessToken', isVerified.data, {
          httpOnly: true,
          secure: true, // 開發環境設為 false，生產環境應設為 true
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 分鐘
        });
        res.status(isVerified.statusCode).json({ success: true, message: isVerified.message });
      } else {
        res.status(isVerified.statusCode).json({ success: true, message: isVerified.message });
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，請稍後再試。'));
    }
  }
};
