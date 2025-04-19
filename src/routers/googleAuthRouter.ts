import express, { Request, Response } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import crypto from 'crypto';

const router = express.Router();
const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

// 產生並回傳 CSRF token，設為 cookie
export const getCsrfToken = (req: Request, res: Response) => {
  try {
    const csrfToken = crypto.randomUUID(); // 產生安全亂數

    res.cookie('g_csrf_token', csrfToken, {
      httpOnly: false, // 讓前端可讀取
      sameSite: 'none', // 跨網域用
      secure: true, // 必須用 HTTPS
      maxAge: 10 * 60 * 1000, // 有效時間：10分鐘
    });

    res.status(200).json({ success: true, csrfToken });
  } catch (error) {
    console.error('❌ 發生錯誤：無法建立 CSRF Token', error);
    res.status(500).json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
};

export const verifyGoogleIdToken = async (req: Request, res: Response) => {
  try {
    const credential = req.body.credential;
    const csrfFromCookie = req.cookies['g_csrf_token'];
    const csrfFromBody = req.body.g_csrf_token;

    if (!credential || !csrfFromCookie || !csrfFromBody) {
      return res.status(400).json({ message: '缺少驗證資料' });
    }

    // Double-submit CSRF 驗證
    if (csrfFromCookie !== csrfFromBody) {
      return res.status(403).json({ message: 'CSRF token 不一致' });
    }

    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      issuer: 'https://accounts.google.com',
      audience: '359200533687-87lah0su6ufvh34gi1c14mt0sudrpp21.apps.googleusercontent.com', // ← 替換成你自己的 Client ID
    });

    // 驗證成功後，可以從 payload 拿到 email、name、sub (user id)
    return res.json({
      success: true,
      message: 'Google ID token is valid.',
      user: {
        email: payload.email,
        name: payload.name,
        sub: payload.sub,
        picture: payload.picture,
      },
    });
  } catch (error) {
    console.error('Google ID Token 驗證失敗:', error);
    return res.status(401).json({ success: false, message: 'Invalid Google ID token.' });
  }
};

router.post('/verifyGoogleIdToken', verifyGoogleIdToken);
router.get('/getCsrfToken', getCsrfToken);

export default router;
