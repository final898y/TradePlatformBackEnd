import { User, UserSchema } from '../model/userModel.js';
import { Request } from 'express';
import { z, ZodError } from 'zod';

async function ValidateUserData(data: object): Promise<string | User> {
  const validateResult = await UserSchema.safeParseAsync(data);
  if (validateResult.success === false) {
    return ZodErrorHandling(validateResult.error);
  } else {
    return validateResult.data;
  }
}

const ValidateRegisterUserSchema = UserSchema.pick({
  Name: true,
  MobilePhone: true,
  Email: true,
  Password: true,
  UserStatus: true,
  Birthday: true,
  Address: true,
  StoreName: true,
});
type ValidateRegister = z.infer<typeof ValidateRegisterUserSchema>;

async function ValidateRegisterData(req: Request): Promise<string | ValidateRegister> {
  const validateResult = await ValidateRegisterUserSchema.safeParseAsync(req.body);
  if (validateResult.success === false) {
    return ZodErrorHandling(validateResult.error);
  } else {
    return validateResult.data;
  }
}

const ValidateUserSchemaOptional = UserSchema.partial();
type ValidateUserPartial = z.infer<typeof ValidateUserSchemaOptional>;

async function ValidatePartialUserData(req: Request): Promise<string | ValidateUserPartial> {
  const validateResult = await ValidateUserSchemaOptional.safeParseAsync(req.body);
  if (validateResult.success === false) {
    return ZodErrorHandling(validateResult.error);
  } else {
    return validateResult.data;
  }
}

function ZodErrorHandling(zoderror: ZodError<ValidateRegister>): string {
  const zodErrorFormat = zoderror.format();
  const zodErrorFormatArray = [
    zodErrorFormat.Name?._errors[0],
    zodErrorFormat.MobilePhone?._errors[0],
    zodErrorFormat.Email?._errors[0],
    zodErrorFormat.Password?._errors[0],
    zodErrorFormat.UserStatus?._errors[0],
    zodErrorFormat.Birthday?._errors[0],
    zodErrorFormat.Address?._errors[0],
    zodErrorFormat.StoreName?._errors[0],
  ].filter((item): item is string => item !== undefined);
  const zodErrorString = zodErrorFormatArray.join('、');
  return '輸入資料有下列錯誤，請進行修正：「' + zodErrorString + '」';
}
export {
  ValidateRegisterData,
  ValidatePartialUserData,
  ZodErrorHandling,
  ValidateUserData,
  ValidateUserPartial,
};
