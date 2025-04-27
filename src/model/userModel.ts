import { z } from 'zod';

enum userStatusEnum {
  Inactive = 0,
  Active = 1,
  Suspended = 2,
}
const UserSchema = z.object({
  UID: z.string(),

  Name: z.string({ required_error: '姓名為必填欄位' }),

  MobilePhone: z
    .string({
      required_error: '手機為必填欄位',
    })
    .length(10, '手機號碼必須為 10 碼')
    .regex(/^\d+$/, '手機號碼只能包含數字'),

  Email: z
    .string({
      required_error: 'Email為必填欄位',
    })
    .email('電子郵件格式錯誤'),

  Password: z
    .string({
      required_error: '密碼為必填欄位',
    })
    .min(8, '密碼長度不可小於 8 個字元'),

  UserStatus: z.nativeEnum(userStatusEnum).default(1),

  Birthday: z.coerce.date({ required_error: '生日為必填欄位' }),

  Address: z.string().optional(),
  StoreName: z.string().optional(),
  CreateDate: z.date().optional(),
  UpdateDate: z.date().optional(),
});
type User = z.infer<typeof UserSchema>;

// function ConvertToUser(data: any): User {
//   const statusMap: { [key: number]: "Inactive" | "Active" | "Suspended" } = {
//       0: "Inactive",
//       1: "Active",
//       2: "Suspended"
//   };

//   const user: User = {
//       UID: data.UID,
//       Name: data.Name,
//       MobilePhone: data.MobilePhone,
//       Email: data.Email,
//       Password: data.Password,
//       UserStatus: statusMap[data.UserStatus], // 將數字狀態映射為字串
//       Birthday: new Date(data.Birthday), // 轉換 Birthday 為 Date 類型
//       Address: data.Address || undefined, // 如果 Address 不存在，設置為 undefined
//       StoreName: data.StoreName || undefined, // 如果 StoreName 不存在，設置為 undefined
//       CreateDate: data.CreateDate ? new Date(data.CreateDate) : undefined, // 檢查是否存在 CreateDate
//       UpdateDate: data.UpdateDate ? new Date(data.UpdateDate) : undefined  // 檢查是否存在 UpdateDate
//   };

//   return user;
// }

export { UserSchema, userStatusEnum };
export type { User };
