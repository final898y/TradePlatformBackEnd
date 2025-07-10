# final898y-tradeplatformbackend

## 專案簡介

這個專案是 `final898y` 交易平台的後端服務。它負責處理使用者認證、商品管理、購物車、結帳流程、支付處理（如 Line Pay 和 ECPay）、資料庫互動、API 路由以及其他核心業務邏輯。整個專案是基於 Node.js 和 TypeScript 開發的，並支援透過 Docker 進行容器化部署。

## 主要功能

- **使用者認證**：提供使用者本地註冊、登入、登出、以及 Google 第三方認證功能。
- **商品目錄**：支援商品列表的查詢、篩選、分頁、以及單一商品詳情查詢。
- **購物車管理**：提供將商品加入購物車、更新數量、刪除商品及清空購物車等完整功能。
- **結帳與訂單**：支援從購物車建立訂單、查詢訂單狀態。
- **支付處理**：整合 Line Pay 和 ECPay 支付閘道。
- **API 服務**：提供豐富的 RESTful API 供前端應用程式或其他服務呼叫。
- **多資料庫支援**：整合 Supabase (PostgreSQL), MySQL, 和 Redis 以應對不同場景需求。
- **錯誤處理與日誌**：完善的錯誤處理機制和日誌記錄。
- **單元測試**：包含多個模組的單元測試，確保程式碼品質。

## 技術棧

這個專案主要使用了以下技術：

- **Node.js**：執行 JavaScript 程式碼的運行環境。
- **TypeScript**：為 JavaScript 增加靜態型別的程式語言。
- **Express.js**：輕量級且靈活的 Node.js Web 應用程式框架。
- **Supabase (PostgreSQL)**：作為主要的關聯式資料庫。
- **MySQL**：另一個支援的關聯式資料庫。
- **Redis**：用於快取和儲存 Session/Token 等臨時資料。
- **PM2**：Node.js 應用程式的生產級程序管理工具。
- **Docker**：容器化平台，用於打包及部署應用程式。(尚未更新)
- **Vitest**：一個快速的單元測試框架。
- **ESLint**：靜態程式碼分析工具。
- **Prettier**：程式碼格式化工具。
- **Swagger**：用於 API 文件化。(尚未更新)

## 專案結構

專案的目錄結構清晰，主要模組分層如下：

```
└── final898y-tradeplatformbackend/
    ├── README.md
    ├── docker-compose.yml
    ├── Dockerfile
    ├── ecosystem.config.cjs
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .github/
    ├── docs/
    │   ├── BackEndAPI_documentation.md
    │   └── Supabase_db_schema.md
    ├── public/
    ├── src/
    │   ├── app.ts
    │   ├── swagger.json
    │   ├── __tests__/
    │   ├── configs/
    │   ├── controllers/
    │   │   ├── AuthController.ts
    │   │   ├── CartController.ts
    │   │   ├── CheckoutflowController.ts
    │   │   ├── ecpayController.ts
    │   │   ├── googleAuthController.ts
    │   │   ├── linepayController.ts
    │   │   ├── productController.ts
    │   │   └── userController.ts
    │   ├── database/
    │   │   ├── Mongo/
    │   │   ├── MySQL/
    │   │   └── Supabase/
    │   ├── helpers/
    │   │   ├── checkoutflowHelper.ts
    │   │   ├── ecpayHelper.ts
    │   │   ├── jwtHelper.ts
    │   │   ├── linepayHelper.ts
    │   │   ├── mysqlHelper.ts
    │   │   ├── postgresqlHelper.ts
    │   │   ├── redisHelper.ts
    │   │   └── supaBaseHelper.ts
    │   ├── middlewares/
    │   │   ├── authorization.ts
    │   │   └── errorHandler.ts
    │   ├── model/
    │   │   ├── authModel.ts
    │   │   ├── cartModel.ts
    │   │   ├── checkoutflowModel.ts
    │   │   ├── payModel.ts
    │   │   ├── productModel.ts
    │   │   └── userModel.ts
    │   ├── repositorys/
    │   │   ├── authRepository.ts
    │   │   ├── cartRepository.ts
    │   │   ├── checkoutflowRepository.ts
    │   │   └── productRepository.ts
    │   ├── routers/
    │   │   ├── authRouter.ts
    │   │   ├── cartRouter.ts
    │   │   ├── CheckoutflowRouter.ts
    │   │   ├── healthRouter.ts
    │   │   ├── indexRouter.ts
    │   │   ├── payRouter.ts
    │   │   ├── productRouter.ts
    │   │   └── userRouter.ts
    │   ├── services/
    │   │   ├── authService.ts
    │   │   ├── cartService.ts
    │   │   ├── checkoutflowService.ts
    │   │   ├── productServices.ts
    │   │   └── userService.ts
    │   ├── types/
    │   └── utility/
    │       ├── hashData.ts
    │       ├── IDGenerater.ts
    │       └── validateData.ts
    └── views/
        ├── index.pug
        ├── login.pug
        └── Register.pug
```

## 環境建置

### 1. 安裝必要工具

在開始之前，請確保您的系統中已安裝以下工具：

- **Node.js**: 建議使用 LTS (長期支援) 版本。
- **npm** (Node Package Manager): 通常會隨 Node.js 一起安裝。
- **Docker** (可選，用於容器化部署)。

### 2. 下載專案

```bash
git clone [你的專案_Git_URL_在這裡]
cd final898y-tradeplatformbackend
```

### 3. 安裝依賴套件

```bash
npm install
```

### 4. 設定環境變數

請在專案根目錄下建立一個 `.env` 檔案，並參考 `env.production` 或 `src/configs/env.ts` 中的變數來設定您的環境變數。

例如：

```
# .env 檔案範例 (請根據實際情況修改)
NODE_ENV=development
PORT=3000

# Supabase/PostgreSQL
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Payment Services
LINEPAY_CHANNEL_ID=your_linepay_channel_id
LINEPAY_CHANNEL_SECRET=your_linepay_channel_secret
ECPAY_MERCHANT_ID=your_ecpay_merchant_id
ECPAY_HASH_KEY=your_ecpay_hash_key
ECPAY_HASH_IV=your_ecpay_hash_iv

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**重要提示：** `.env` 檔案應被列在 `.gitignore` 中，避免將敏感資訊上傳到版本控制系統中。

### 5. 執行應用程式

#### 開發模式

```bash
npm run dev
```

#### 生產模式

```bash
npm run build # 編譯 TypeScript 程式碼
npm start     # 使用 PM2 啟動應用程式
```

### 6. 運行測試

```bash
npm test
```

### 7. 使用 Docker (可選)

1.  **建置 Docker 映像檔：**
    ```bash
    docker build -t final898y-backend .
    ```
2.  **運行 Docker 容器：**
    ```bash
    docker run -p 3000:3000 final898y-backend
    ```
3.  **使用 Docker Compose：**
    ```bash
    docker-compose up -d
    ```

## 持續整合與部署 (CI/CD)

這個專案配置了 GitHub Actions (`.github/workflows/main_tradebackendApiTest.yml`) 來實現自動化的建置、測試和部署流程。

## API 文件

本專案使用 Swagger 進行 API 文件化。在應用程式啟動後，您可以透過特定路徑（例如：`http://localhost:3000/api-docs`）訪問互動式的 API 文件。同時，您也可以參考 `docs/BackEndAPI_documentation.md` 獲取更詳細的靜態文件。

## 貢獻

如果您想為這個專案做出貢獻，請參考以下步驟：

1.  Fork 這個專案。
2.  建立一個新的分支 (`git checkout -b feature/your-feature-name`)。
3.  進行您的更改並提交 (`git commit -m 'Add some feature'`)。
4.  推送到分支 (`git push origin feature/your-feature-name`)。
5.  提交一個 Pull Request。

## 許可證

本專案採用 MIT License，詳見 [LICENSE.md](./LICENSE.md) 檔案。
