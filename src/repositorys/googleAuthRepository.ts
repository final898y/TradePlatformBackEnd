import * as supaBaseHelper from '../helpers/supaBaseHelper.js';
import ItransportResult from '../model/transportModel.js';

export const verifyGoogleIdToken = async (googlesub: string): Promise<ItransportResult<string>> => {
  try {
    // 查 auth_providers，找符合的紀錄
    const { data: authData, error: authError } = await supaBaseHelper.supabase
      .from('auth_providers')
      .select('id')
      .eq('provider', 'google')
      .eq('provider_user_id', googlesub)
      .single(); // 預期只會有一筆

    if (authError) {
      return {
        success: false,
        statusCode: 500,
        message: `auth_providers query error: ${authError.message}`,
      };
    }

    if (!authData?.id) {
      return {
        success: false,
        statusCode: 400,
        message: 'auth_providers: no matching user id found',
      };
    }

    // 查 users 表，找該 id 的 email
    const { data: userData, error: userError } = await supaBaseHelper.supabase
      .from('users')
      .select('mobilephone')
      .eq('id', authData.id)
      .single(); // 預期只會一筆

    if (userError) {
      return {
        success: false,
        statusCode: 500,
        message: `users query error: ${userError.message}`,
      };
    }

    if (!userData?.mobilephone) {
      return {
        success: false,
        statusCode: 400,
        message: 'users: mobilephone not found',
      };
    }

    // 成功回傳 email
    return {
      success: true,
      statusCode: 200,
      message: 'get user mobilephone',
      data: userData.mobilephone,
    };
  } catch (e: any) {
    return {
      success: false,
      statusCode: 500,
      message: `unexpected error: ${e.message}`,
    };
  }
};
