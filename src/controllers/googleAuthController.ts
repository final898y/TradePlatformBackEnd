import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../middlewares/errorHandler.js';
import * as googleAuthService from '../services/googleAuthService.js';

// 產生並回傳 CSRF token，設為 cookie
export const getCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transportData = await googleAuthService.getCsrfToken();
    const { data: csrfToken = '' } = transportData;
    if (csrfToken === undefined) {
      return res.status(500).json({
        success: false,
        message: '伺服器錯誤，無法建立 CSRF Token，請稍後再試。',
      });
    } else {
      res.cookie('g_csrf_token', csrfToken, {
        httpOnly: false, // 讓前端可讀取
        sameSite: 'none', // 跨網域用
        secure: true, // 必須用 HTTPS
        maxAge: 10 * 60 * 1000, // 有效時間：10分鐘
      });
      res.status(200).json({ success: 'true', csrfToken });
    }
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(500, error.message, error.stack, error.name));
    } else {
      next(new ApiError(500, '伺服器錯誤，無法建立 CSRF Token，請稍後再試。'));
    }
  }
};

const GoogleCredentialSchema = z.object({
  credential: z.string(),
  g_csrf_token: z.string(),
});

export const verifyGoogleIdToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = GoogleCredentialSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: '格式錯誤', errors: parseResult.error.flatten() });
    }
    const credential = parseResult.data.credential;
    const csrfFromCookie = req.cookies['g_csrf_token'];
    const csrfFromBody = parseResult.data.g_csrf_token;

    if (!csrfFromCookie) {
      return res.status(400).json({ message: '缺少 CSRF Cookie' });
    }

    // Double-submit CSRF 驗證
    if (csrfFromCookie !== csrfFromBody) {
      return res.status(403).json({ message: 'CSRF token 不一致' });
    }

    const transportResult = await googleAuthService.verifyGoogleIdToken(credential);
    res
      .status(transportResult.statusCode)
      .json({ message: transportResult.message, data: transportResult.data });
  } catch (error) {
    if (error instanceof Error) {
      next(new ApiError(401, error.message, error.stack, error.name));
    } else {
      next(new ApiError(401, 'Google ID Token 驗證失敗'));
    }
  }
};
