export default interface ItransportResult<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T; // 用泛型 T 代表資料結構
  JwtToken?: string;
}
