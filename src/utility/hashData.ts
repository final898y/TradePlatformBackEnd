import bcrypt from 'bcryptjs';

async function Hashdata(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    if (err instanceof Error) {
      return '加密時發生錯誤: ' + err.message;
    }
    return '';
  }
}

async function ValidateHash(password: string, hashdata: string): Promise<boolean> {
  try {
    const matchResult = await bcrypt.compare(password, hashdata);
    return matchResult;
  } catch (err) {
    if (err instanceof Error) {
      console.log('發生錯誤: ' + err.message);
      return false;
    }
    return false;
  }
}
export { Hashdata, ValidateHash };
