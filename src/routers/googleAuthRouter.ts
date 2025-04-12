import express, { Request, Response } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const router = express.Router();
const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

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

export default router;
