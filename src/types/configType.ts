export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
}

export interface Config {
  linepayredirectUrls: {
    confirmUrl: string;
    cancelUrl: string;
  };
  allowedOrigins: string[];
  redisconfig: {
    username: string;
    host: string;
    port: number;
  };
  csrfCookieOptions: CookieOptions;
  tpaccessTokenCookieOptions: CookieOptions;
  tprefreshTokenCookieOptions: CookieOptions;
}
