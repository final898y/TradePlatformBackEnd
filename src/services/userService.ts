import { Request } from 'express';

import * as UserRepository from '../repositorys/userRepository.js';
import ItransportResult from '../model/transportModel.js';
import * as ValidateData from '../utility/validateData.js';
import generateID from '../utility/IDGenerater.js';
import { ValidateHash } from '../utility/hashData.js';
import * as JwtHelper from '../helpers/jwtHelper.js';
import * as redisHelper from '../helpers/redisHelper.js';
import env from '../configs/env.js';

async function GetAllUsers(): Promise<ItransportResult> {
  const userDetailArray = await UserRepository.GetAllUsers();
  if (userDetailArray.length === 0) {
    return {
      success: false,
      statusCode: 404,
      message: 'User not found.',
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Get the results.',
    data: userDetailArray,
  };
}

async function GetUserDetail(UID: string): Promise<ItransportResult> {
  if (!UID) {
    return {
      success: false,
      statusCode: 400,
      message: 'UID is required.',
    };
  } else {
    const results = await UserRepository.GetUserDetail(UID);
    if (results.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'User not found.',
      };
    } else {
      return {
        success: true,
        statusCode: 200,
        message: "Get the user's details.",
        data: results[0],
      };
    }
  }
}

async function Register(req: Request): Promise<ItransportResult> {
  const validateResult = await ValidateData.ValidateRegisterData(req);
  if (typeof validateResult === 'string') {
    return {
      success: false,
      statusCode: 400,
      message: validateResult,
    };
  } else {
    const uid = generateID('UID');
    const addUIDtovalidateResult = { UID: uid, ...validateResult };
    const results = await UserRepository.Register(addUIDtovalidateResult);
    if (typeof results === 'number') {
      return {
        success: false,
        statusCode: 422,
        message: '電話號碼重複，註冊失敗',
      };
    } else if (results.affectedRows > 0) {
      return {
        success: true,
        statusCode: 200,
        message: '註冊成功',
      };
    } else
      return {
        success: false,
        statusCode: 422,
        message: '註冊失敗',
      };
  }
}

async function EditUser(req: Request, UID: string): Promise<ItransportResult> {
  const validateResult = await ValidateData.ValidatePartialUserData(req);
  if (typeof validateResult === 'string') {
    return {
      success: false,
      statusCode: 400,
      message: validateResult,
    };
  } else {
    const resultSetHeader = await UserRepository.EditUser(validateResult, UID);
    if (resultSetHeader.affectedRows > 0) {
      return {
        success: true,
        statusCode: 200,
        message: '更新資料成功',
      };
    } else
      return {
        success: false,
        statusCode: 400,
        message: '更新資料失敗',
      };
  }
}

async function Login(req: Request): Promise<ItransportResult> {
  const validateResult = await ValidateData.ValidatePartialUserData(req);
  if (typeof validateResult === 'string') {
    return {
      success: false,
      statusCode: 400,
      message: validateResult,
    };
  } else {
    if (validateResult.MobilePhone !== undefined && validateResult.Password !== undefined) {
      const results = await UserRepository.Login(
        validateResult.MobilePhone,
        validateResult.Password,
      );
      if (results.length !== 0) {
        const selectUser = results[0] as Record<string, any>;
        const jwtKey = env.ACCESS_TOKEN_SECRET;
        if (await ValidateHash(validateResult.Password, selectUser.Password)) {
          const JwtToken = await JwtHelper.createJwt(
            validateResult.MobilePhone,
            selectUser.email,
            jwtKey,
            '1h',
          );
          await redisHelper.setData(validateResult.MobilePhone, JwtToken);
          return {
            success: true,
            statusCode: 200,
            message: '登入成功',
            JwtToken: JwtToken,
          };
        } else {
          return {
            success: false,
            statusCode: 401,
            message: '密碼錯誤',
          };
        }
      }
      return {
        success: false,
        statusCode: 401,
        message: '找不到此用戶',
      };
    } else if (validateResult.MobilePhone === undefined && validateResult.Password !== undefined) {
      return {
        success: false,
        statusCode: 400,
        message: '請輸入手機號碼',
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        message: '請輸入密碼',
      };
    }
  }
}

export { GetAllUsers, GetUserDetail, Register, EditUser, Login };
