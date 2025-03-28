import { Request, Response, NextFunction } from 'express';

// 自定義錯誤類型
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, stack?: string, name?: string) {
    super(message);
    this.statusCode = statusCode;

    // 保留原始錯誤的 name
    this.name = name ?? 'ApiError';

    // 保留 stack 資訊
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype); // 確保 instanceof 正常
  }
}

// 全局錯誤處理函數
const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${err.name}] ${err.stack}`); // 記錄錯誤類別與堆疊

  res.status(err.statusCode || 500).json({
    status: 'error',
    name: err.name, // 回傳錯誤類別
    message: err.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}), // 只在開發環境返回 stack
  });
};

export { ApiError, errorHandler };
