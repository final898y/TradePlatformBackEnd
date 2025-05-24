import * as redisHelper from '../helpers/redisHelper.js';
import ItransportResult from '../model/transportModel.js';

export const searchTokenbyRedis = async (
  token: string,
  mobilephone: string,
  tokenType: string,
): Promise<ItransportResult<string>> => {
  try {
    const rediskey = `${mobilephone}tp${tokenType}`;
    const retrievedResult = await redisHelper.getData(rediskey);
    if (retrievedResult.success === false) {
      return {
        success: false,
        statusCode: 404,
        message: 'Token is not find',
      };
    }
    if (retrievedResult.data !== token) {
      return {
        success: false,
        statusCode: 401,
        message: 'RetrievedValue is not valid',
      };
    } else {
      return {
        success: true,
        statusCode: 200,
        message: 'Token is valid',
        data: token,
      };
    }
  } catch (error) {
    throw error;
  }
};
