import { z } from 'zod';
import ItransportResult from '@/model/transportModel.js';
import * as jwtHelper from '@/helpers/jwtHelper.js';
import env from '@/configs/env.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = env;
const AccessAndRefreshTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

type AccessAndRefreshToken = z.infer<typeof AccessAndRefreshTokenSchema>;
export const createAccessAndRefreshToken = async (
  mobilephone: string,
  email: string,
): Promise<ItransportResult<AccessAndRefreshToken>> => {
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
