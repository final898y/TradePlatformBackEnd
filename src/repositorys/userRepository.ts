import { ResultSetHeader } from 'mysql2/promise';
import { User } from '../model/userModel.js';
import * as mysqlHelper from '../helpers/mysqlHelper.js';
import { Hashdata } from '../utility/hashData.js';
import { ValidateUserPartial } from '../utility/validateData.js';

async function GetAllUsers(): Promise<object[]> {
  return await mysqlHelper.SelectQuery('User');
}

async function GetUserDetail(UID: string): Promise<object[]> {
  return await mysqlHelper.SelectQuery('User', ['UID'], [UID]);
}

async function Register(RegisterData: User): Promise<ResultSetHeader | number> {
  const insertField = [
    'UID',
    'Name',
    'MobilePhone',
    'Email',
    'Password',
    'Birthday',
    'Address',
    'StoreName',
  ];
  const hashedPassword = await Hashdata(RegisterData.Password);
  const insertValue = [
    RegisterData.UID,
    RegisterData.Name,
    RegisterData.MobilePhone,
    RegisterData.Email,
    hashedPassword,
    RegisterData.Birthday,
    RegisterData.Address,
    RegisterData.StoreName,
  ];
  return mysqlHelper.InsertAfterSelectQuery(
    'User',
    insertValue,
    ['MobilePhone'],
    [RegisterData.MobilePhone],
    insertField,
  );
}

async function EditUser(UpdateData: ValidateUserPartial, UID: string): Promise<ResultSetHeader> {
  const updateField: string[] = (Object.keys(UpdateData) as (keyof typeof UpdateData)[]).filter(
    (key) => UpdateData[key] !== undefined,
  );
  const updateAndFilterValue = [
    UpdateData.Name,
    UpdateData.MobilePhone,
    UpdateData.Email,
    UpdateData.Birthday,
    UpdateData.Address,
    UpdateData.StoreName,
    UID,
  ].filter((value) => value !== undefined);
  return mysqlHelper.UpdateQuery('User', updateField, updateAndFilterValue, 'UID');
}

async function Login(MobilePhone: string, Password: string): Promise<object[]> {
  const results = await mysqlHelper.SelectQuery('User', ['MobilePhone'], [MobilePhone]);
  if(results!==undefined){
      return results;
  }
  return []
}

export { GetAllUsers, GetUserDetail, Register, EditUser, Login };
