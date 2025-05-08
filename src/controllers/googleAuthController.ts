import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../middlewares/errorHandler.js';
import * as googleAuthService from '../services/googleAuthService.js';
import * as authService from '../services/authService.js';
import * as redisHelper from '../helpers/redisHelper.js';

const GoogleCredentialSchema = z.object({
  credential: z.string(),
  g_csrf_token: z.string(),
});

export const verifyGoogleIdToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = GoogleCredentialSchema.safeParse(req.body);
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
    if (csrfCheckResult.success === false) {
      return res
        .status(csrfCheckResult.statusCode)
        .json({ success: false, message: csrfCheckResult.message });
    }
    // 驗證 Google ID token
    const credential = parseResult.data.credential;
    const verifyGoogleIdResult = await googleAuthService.verifyGoogleIdToken(credential);
    if (verifyGoogleIdResult.success === false || !verifyGoogleIdResult.data) {
      return res
        .status(verifyGoogleIdResult.statusCode)
        .json({ success: false, message: verifyGoogleIdResult.message });
    }

    //取得JWT token
    const getJWTResult = await authService.createAccessAndRefreshToken(
      verifyGoogleIdResult.data.mobilephone,
      verifyGoogleIdResult.data.email,
    );
    if (getJWTResult.success === false || !getJWTResult.data) {
      return res.status(500).json({ success: false, message: 'Get Token Error' });
    }
    //將JWT token 存入redis
    const [accessSuccess, refreshSuccess] = await Promise.all([
      redisHelper.setData(
        `${verifyGoogleIdResult.data.mobilephone}tpaccessToken`,
        getJWTResult.data.accessToken,
        15 * 60,
      ),
      redisHelper.setData(
        `${verifyGoogleIdResult.data.mobilephone}tprefreshToken`,
        getJWTResult.data.refreshToken,
        7 * 24 * 60 * 60,
      ),
    ]);
    if (!accessSuccess || !refreshSuccess) {
      return res.status(500).json({ success: false, message: 'Set Token Error' });
    }
    //驗證完成後回傳資料
    res.cookie('tpaccessToken', getJWTResult.data.accessToken, {
      httpOnly: true,
      secure: true, // 開發環境設為 false，生產環境應設為 true
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 分鐘
    });
    res.cookie('tprefreshToken', getJWTResult.data.refreshToken, {
      httpOnly: true,
      secure: true, // 開發環境設為 false，生產環境應設為 true
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });
    res.status(200).json({
      success: true,
      message: 'Google ID Token 驗證成功',
      data: verifyGoogleIdResult.data,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new ApiError(401, error.message, error.stack, error.name));
    } else {
      next(new ApiError(401, 'Google ID Token 驗證失敗'));
    }
  }
};
