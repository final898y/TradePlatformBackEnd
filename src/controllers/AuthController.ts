import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler.js';
import * as authService from '../services/authService.js';
import * as redisHelper from '../helpers/redisHelper.js';
import { z } from 'zod';
import config from '../configs/configIndex.js';

// 產生並回傳 CSRF token，設為 cookie
export const getCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportData = await authService.getCsrfToken();
    const { data: csrfToken = '' } = transportData;
    if (csrfToken === undefined) {
      return res.status(500).json({
        success: false,
        message: '伺服器錯誤，無法建立 CSRF Token，請稍後再試。',
      });
    } else {
      res.cookie('g_csrf_token', csrfToken, config.csrfCookieOptions);
      res.status(200).json({ success: true, message: '建立 CSRF Token 成功', data: csrfToken });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法建立 CSRF Token，請稍後再試。'));
    }
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies['tpaccessToken'];
    const refreshToken = req.cookies['tprefreshToken'];
    if (!accessToken && !refreshToken) {
      console.log('Access token and refresh token both missing');
      res.status(500).json({ success: false, message: 'Missing accessToken and refreshToken' });
    } else if (accessToken && !refreshToken) {
      console.log('Refresh token is missing');
      res.status(500).json({ success: false, message: 'Missing refreshToken' });
    }

    const isVerified = await authService.verifyToken(accessToken, refreshToken);
    if (isVerified.success === false || !isVerified.data) {
      res.status(isVerified.statusCode).json({ success: false, message: isVerified.message });
    } else {
      if (isVerified.message === 'new accessToken') {
        res.cookie('tpaccessToken', isVerified.data, config.tpaccessTokenCookieOptions);
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

const logoutRequestSchema = z.object({
  mobilephone: z.string().min(1, 'mobilephone 不可為空'),
  g_csrf_token: z.string().min(1, 'g_csrf_token 不可為空'),
});

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = logoutRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'request body格式錯誤',
        errordetail: parseResult.error.flatten(),
      });
    }

    // 驗證 CSRF token
    const csrfFromCookie = req.cookies['g_csrf_token'];
    const csrfFromBody = parseResult.data.g_csrf_token;
    const csrfCheckResult = await authService.CheckDoubleSubmitCSRF(csrfFromCookie, csrfFromBody);
    if (!csrfCheckResult.success) {
      return res
        .status(csrfCheckResult.statusCode)
        .json({ success: false, message: csrfCheckResult.message });
    }
    await redisHelper.deleteData(`${parseResult.data.mobilephone}tpaccessToken`);
    await redisHelper.deleteData(`${parseResult.data.mobilephone}tprefreshToken`);
    res.cookie('tpaccessToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
    });
    res.cookie('tprefreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
    });
    console.log(`[Logout] 使用者 ${parseResult.data.mobilephone} 已登出`);

    res.status(200).json({ success: true, message: '登出成功' });
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
