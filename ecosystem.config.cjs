// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'tradeplatform', // 應用名稱（可自訂）
      script: './build/src/app.js', // 主程式進入點
      instances: 1, // 啟動幾個實例（1 表示單一）
      exec_mode: 'fork', // 用 fork 模式（非 cluster）
      watch: false, // 若不需熱重啟則關掉 watch
      autorestart: true, // 程式錯誤時自動重啟
      out_file: './logs/out.log', // 標準輸出 log
      error_file: './logs/error.log', // 錯誤輸出 log
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // log 的時間格式
    },
  ],
};
