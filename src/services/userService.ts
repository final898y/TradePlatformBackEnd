import { Request } from 'express';

import * as UserRepository from '../repositorys/userRepository.js';
import ItransportResult from '../model/transportModel.js';
import * as ValidateData from '../utility/validateData.js';
import generateID from '../utility/IDGenerater.js';
import { ValidateHash } from '../utility/hashData.js';
import * as JwtHelper from '../helpers/jwtHelper.js';


async function GetAllUsers(): Promise<ItransportResult> {
  const userDetailArray = await UserRepository.GetAllUsers();
  if (userDetailArray.length === 0) {
    return {
      success: false,
      statusCode: 404,
      message: 'User not found.',
    } as ItransportResult;
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Get the results.',
    data: userDetailArray,
  } as ItransportResult;
}

async function GetUserDetail(UID: string): Promise<ItransportResult> {
  if (!UID) {
    return {
      success: false,
      statusCode: 400,
      message: 'UID is required.',
    } as ItransportResult;
  }else {
    const results = await UserRepository.GetUserDetail(UID);
    if (results.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'User not found.',
      } as ItransportResult;
    } else {
      return {
        success: true,
        statusCode: 200,
        message: "Get the user's details.",
        data: results[0],
      } as ItransportResult;
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
    } as ItransportResult;
  } else {
    const uid = generateID('UID');
    const addUIDtovalidateResult = { UID: uid, ...validateResult };
    const results = await UserRepository.Register(addUIDtovalidateResult);
    if (typeof results === 'number') {
      return {
        success: false,
        statusCode: 422,
        message: '電話號碼重複，註冊失敗',
      } as ItransportResult;
    } else if (results.affectedRows > 0) {
      return {
        success: true,
        statusCode: 200,
        message: '註冊成功',
      } as ItransportResult;
    } else
      return {
        success: false,
        statusCode: 422,
        message: '註冊失敗',
      } as ItransportResult;
    } 
}

async function EditUser(req: Request, UID: string): Promise<ItransportResult> {
  const validateResult = await ValidateData.ValidatePartialUserData(req);
  if (typeof validateResult === 'string') {
    return {
      success: false,
      statusCode: 400,
      message: validateResult,
    } as ItransportResult;
  } else {
      const resultSetHeader = await UserRepository.EditUser(validateResult, UID);
      if (resultSetHeader.affectedRows > 0) {
        return {
          success: true,
          statusCode: 200,
          message: '更新資料成功',
        } as ItransportResult;
      } else
        return {
          success: false,
          statusCode: 400,
          message: '更新資料失敗',
        } as ItransportResult;
    }
}

async function Login(req: Request): Promise<ItransportResult> {
  const validateResult = await ValidateData.ValidatePartialUserData(req);
  if (typeof validateResult === 'string') {
    return {
      success: false,
      statusCode: 400,
      message: validateResult,
    } as ItransportResult;
  } else {
      if (validateResult.MobilePhone !== undefined && validateResult.Password !== undefined) {
        const results = await UserRepository.Login(
          validateResult.MobilePhone,
          validateResult.Password,
        );
        if (results.length !== 0) {
          const selectUser = results[0] as Record<string, any>;
          if (await ValidateHash(validateResult.Password, selectUser.Password)) {
            const JwtToken = await JwtHelper.createJwt(validateResult.MobilePhone,selectUser.Password)
            return {
              success: true,
              statusCode: 200,
              message: '登入成功',
              JwtToken:JwtToken,
            } as ItransportResult;
          } else {
            return {
              success: false,
              statusCode: 401,
              message: '密碼錯誤',
            } as ItransportResult;
          }
        }
        return {
          success: false,
          statusCode: 401,
          message: '找不到此用戶',
        } as ItransportResult;
      } else if (
        validateResult.MobilePhone === undefined &&
        validateResult.Password !== undefined
      ) {
        return {
          success: false,
          statusCode: 400,
          message: '請輸入手機號碼',
        } as ItransportResult;
      } else {
        return {
          success: false,
          statusCode: 400,
          message: '請輸入密碼',
        } as ItransportResult;
      }
    }
}

export { GetAllUsers, GetUserDetail, Register, EditUser, Login };
