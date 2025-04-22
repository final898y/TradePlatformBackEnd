import * as supaBaseHelper from '../helpers/supaBaseHelper.js';

export const verifyGoogleIdToken = async (googleid: string): Promise<boolean> => {
  try {
    const { data, error } = await supaBaseHelper.supabase
      .from('auth_providers') // 替換成你的資料表名稱
      .select('id') // 只查 id 就好，效率較高
      .eq('provider', 'google')
      .eq('provider_user_id', googleid)
      .limit(1); // 只要一筆結果就好，提早終止查詢
    if (error) {
      console.error('查詢錯誤：', error.message);
      return false;
    }
    return data.length > 0;
  } catch (error) {
    throw error;
  }
};
