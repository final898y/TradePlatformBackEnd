import crypto from 'crypto';
import ItransportResult from '../model/transportModel.js';
import * as jwtHelper from '../helpers/jwtHelper.js';
import env from '../configs/env.js';
import * as authModel from '../model/authModel.js';
import * as authRepository from '../repositorys/authRepository.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = env;

export const getCsrfToken = async (): Promise<ItransportResult<string>> => {
  try {
    const csrfToken = crypto.randomUUID(); // 產生安全亂數
    return {
      success: true,
      statusCode: 200,
      message: 'get the Csrf Token',
      data: csrfToken,
    };
  } catch (error) {
    throw error;
  }
};

export const CheckDoubleSubmitCSRF = async (
  csrfFromCookie: unknown,
  csrfFromBody: string,
): Promise<ItransportResult<string>> => {
  // Check if cookie exists and is a string
  if (typeof csrfFromCookie !== 'string' || !csrfFromCookie) {
    return {
      success: false,
      statusCode: 400,
      message: '無效的 CSRF Cookie',
    };
  }

  // Double-submit CSRF verification with strict equality
  if (csrfFromCookie !== csrfFromBody) {
    return {
      success: false,
      statusCode: 403,
      message: 'CSRF token 驗證失敗',
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: 'CSRF 驗證成功',
    data: csrfFromBody,
  };
};

export const createAccessAndRefreshToken = async (
  mobilephone: string,
  email: string,
): Promise<ItransportResult<authModel.AccessAndRefreshToken>> => {
  try {
    const accessToken = await jwtHelper.createJwt(mobilephone, email, ACCESS_TOKEN_SECRET, '15m');
    const refreshToken = await jwtHelper.createJwt(mobilephone, email, REFRESH_TOKEN_SECRET, '7d');
    return {
      success: true,
      statusCode: 200,
      message: 'Token create success',
      data: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

async function verifyOneToken(
  Token: string,
  secret: string,
  tokenType: string,
): Promise<authModel.VerifiedTokenResult> {
  try {
    const isTokenVerified = await jwtHelper.verifyJwt(Token, secret);
    if (isTokenVerified.success === false || !isTokenVerified.data) {
      return {
        isjwtVerified: false,
        isRedisVerified: false,
      };
    } else {
      const retrievedRedisResult = await authRepository.searchTokenbyRedis(
        Token,
        isTokenVerified.data.mobilephone,
        tokenType,
      );
      if (retrievedRedisResult.success === false) {
        return {
          isjwtVerified: true,
          isRedisVerified: false,
          verifiedMobilephone: isTokenVerified.data.mobilephone,
          verifiedEmail: isTokenVerified.data.email,
        };
      } else {
        return {
          isjwtVerified: true,
          isRedisVerified: true,
          verifiedMobilephone: isTokenVerified.data.mobilephone,
          verifiedEmail: isTokenVerified.data.email,
        };
      }
    }
  } catch (error) {
    throw error;
  }
}

export const verifyToken = async (
  accessToken: string,
  refreshToken: string,
): Promise<ItransportResult<string>> => {
  try {
    //先驗證accessToken
    const isAccessTokenVerified = await verifyOneToken(
      accessToken,
      ACCESS_TOKEN_SECRET,
      'accessToken',
    );
    if (isAccessTokenVerified.isjwtVerified === false) {
      return {
        success: false,
        statusCode: 401,
        message: 'accessToken is not valid',
      };
    }
    if (isAccessTokenVerified.isRedisVerified === true) {
      return {
        success: true,
        statusCode: 200,
        message: 'Verified',
        data: accessToken,
      };
    } else {
      //accessToken驗證通過、過期=>再驗證RefreshToken
      const isRefreshTokenVerified = await verifyOneToken(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        'refreshToken',
      );
      if (
        isRefreshTokenVerified.isjwtVerified === false ||
        isRefreshTokenVerified.isRedisVerified === false ||
        !isRefreshTokenVerified.verifiedMobilephone ||
        !isRefreshTokenVerified.verifiedEmail
      ) {
        return {
          success: false,
          statusCode: 401,
          message: 'refreshToken is not valid',
        };
      }
      //生成新AccessToken
      const newAccessToken = await jwtHelper.createJwt(
        isRefreshTokenVerified.verifiedMobilephone,
        isRefreshTokenVerified.verifiedEmail,
        ACCESS_TOKEN_SECRET,
        '15m',
      );
      return {
        success: true,
        statusCode: 200,
        message: 'new accessToken',
        data: newAccessToken,
      };
    }
  } catch (error) {
    throw error;
  }
};
