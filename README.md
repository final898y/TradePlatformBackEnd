# final898y-tradeplatformbackend

## 專案簡介

這個專案是 `final898y` 交易平台的後端服務。它負責處理使用者認證、支付處理（如 Line Pay 和 ECPay）、資料庫互動、API 路由以及其他核心業務邏輯。整個專案是基於 Node.js 和 TypeScript 開發的，並支援透過 Docker 進行容器化部署。

## 主要功能

- **使用者認證**：提供使用者登入、註冊、Google 認證等功能。
- **支付處理**：整合 Line Pay 和 ECPay 支付閘道。
- **API 服務**：提供豐富的 RESTful API 供前端應用程式或其他服務呼叫。
- **資料庫互動**：連接並操作 MongoDB 資料庫。
- **錯誤處理與日誌**：完善的錯誤處理機制和日誌記錄。
- **單元測試**：包含多個模組的單元測試，確保程式碼品質。

## 技術棧

這個專案主要使用了以下技術：

- **Node.js**：執行 JavaScript 程式碼的運行環境。
- **TypeScript**：為 JavaScript 增加靜態型別的程式語言，有助於開發大型應用程式。
- **Express.js**：一個輕量級且靈活的 Node.js Web 應用程式框架，用於建立 API。
- **MongoDB**：一個 NoSQL 文件型資料庫，用於儲存應用程式資料。
- **Mongoose**：MongoDB 的物件資料模型 (ODM) 函式庫，讓 Node.js 更容易操作 MongoDB。
- **PM2**：Node.js 應用程式的生產級程序管理工具，用於保持應用程式常駐。
- **Docker**：容器化平台，讓應用程式及其所有依賴項打包成一個可移植的容器。
- **Vitest**：一個快速的單元測試框架。
- **ESLint**：一個靜態程式碼分析工具，用於找出程式碼中的問題。
- **Prettier**：一個程式碼格式化工具，確保程式碼風格一致。
- **Swagger**：用於設計、建立、文件化和消費 RESTful Web 服務的工具。

## 專案結構

專案的目錄結構清晰，主要模組分層如下：

```
└── final898y-tradeplatformbackend/
├── README.md
├── docker-compose.yml # Docker Compose 設定檔，用於多容器應用程式
├── Dockerfile # Docker 映像檔的建置指令
├── ecosystem.config.cjs # PM2 設定檔，用於 Node.js 應用程式的管理
├── env.production # 生產環境變數設定
├── eslint.config.mjs # ESLint 程式碼風格檢查設定
├── package.json # 專案套件資訊與腳本
├── register-hooks.js
├── tsconfig.json # TypeScript 編譯設定
├── vite.config.ts # Vite 建置工具設定
├── .editorconfig # 編輯器設定檔，確保跨編輯器的一致性
├── .prettierrc # Prettier 程式碼格式化設定
├── public/ # 公開可訪問的靜態檔案
│ └── axiosTest.html # 測試用的 HTML 頁面
├── src/ # 專案原始碼
│ ├── app.ts # 應用程式主要進入點
│ ├── cert.crt.txt # SSL 憑證檔案
│ ├── key.pem.txt # SSL 私鑰檔案
│ ├── swagger.json # Swagger API 文件定義
│ ├── **tests**/ # 單元測試檔案
│ │ ├── hashData.test.ts
│ │ ├── linepayHelper.test.ts
│ │ └── configs/
│ │ ├── configIndex.test.ts
│ │ └── vitestEnvConfig.test.ts
│ ├── configs/ # 設定檔
│ │ ├── config.development.ts # 開發環境設定
│ │ ├── config.production.ts # 生產環境設定
│ │ ├── configIndex.ts
│ │ ├── env.ts # 環境變數載入
│ │ ├── linepayConfig.ts # Line Pay 設定
│ │ └── vitestEnvConfig.ts
│ ├── controllers/ # 處理 API 請求的控制器
│ │ ├── AuthController.ts # 認證相關控制器
│ │ ├── ecpayController.ts # ECPay 相關控制器
│ │ ├── googleAuthController.ts # Google 認證相關控制器
│ │ ├── linepayController.ts # Line Pay 相關控制器
│ │ └── userController.ts # 使用者相關控制器
│ ├── database/ # 資料庫相關程式碼
│ │ ├── Mongo/ # MongoDB 相關
│ │ │ ├── index.ts
│ │ │ └── schemas/ # 資料庫模型定義
│ │ │ ├── UserSchema.ts
│ │ │ └── ...
│ │ └── index.ts
│ ├── helpers/ # 輔助函數
│ │ ├── LinePayHelper.ts
│ │ ├── Logger.ts
│ │ └── ...
│ ├── middlewares/ # Express 中介軟體
│ │ ├── authMiddleware.ts
│ │ └── ...
│ ├── models/ # 資料模型定義 (與資料庫結構對應)
│ │ ├── interfaces/
│ │ │ └── UserInterface.ts
│ │ └── User.ts
│ ├── routes/ # API 路由定義
│ │ ├── AuthRoute.ts
│ │ ├── ecpayRoute.ts
│ │ ├── googleAuthRoute.ts
│ │ ├── linepayRoute.ts
│ │ └── userRoute.ts
│ └── services/ # 業務邏輯服務
│ ├── AuthService.ts
│ ├── UserService.ts
│ └── ...
```

## 環境建置

### 1. 安裝必要工具

在開始之前，請確保您的系統中已安裝以下工具：

- **Node.js**: 建議使用 LTS (長期支援) 版本。您可以從 [Node.js 官方網站](https://nodejs.org/) 下載安裝。
- **npm** (Node Package Manager): 通常會隨 Node.js 一起安裝。
- **Docker** (可選，用於容器化部署): 您可以從 [Docker 官方網站](https://www.docker.com/get-started) 下載安裝 Docker Desktop。

### 2. 下載專案

```bash
git clone [你的專案_Git_URL_在這裡]
cd final898y-tradeplatformbackend
```

### 3. 安裝依賴套件

進入專案目錄後，執行以下命令安裝所有必要的 Node.js 套件：

```bash
npm install
```

### 4. 設定環境變數

這個專案使用環境變數來管理敏感資訊和不同環境下的配置。請在專案根目錄下建立一個 `.env` 檔案，並參考 `env.production` 或 `src/configs/env.ts` 中的變數來設定您的環境變數。

例如：

```
# .env 檔案範例 (請根據實際情況修改)
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/your_database_name
LINEPAY_CHANNEL_ID=your_linepay_channel_id
LINEPAY_CHANNEL_SECRET=your_linepay_channel_secret
ECPAY_MERCHANT_ID=your_ecpay_merchant_id
ECPAY_HASH_KEY=your_ecpay_hash_key
ECPAY_HASH_IV=your_ecpay_hash_iv
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**重要提示：** `.env` 檔案應被列在 `.gitignore` 中，避免將敏感資訊上傳到版本控制系統中。

### 5. 執行應用程式

#### 開發模式

在開發模式下，您可以執行以下命令來啟動應用程式（通常會監聽檔案變更並自動重啟）：

```bash
npm run dev
```

#### 生產模式

如果要在生產環境中運行，建議先進行建置，然後使用 PM2 來管理應用程式：

```bash
npm run build # 編譯 TypeScript 程式碼
npm start     # 使用 PM2 啟動應用程式 (會使用 ecosystem.config.cjs 設定)
```

或直接：

```bash
npm run start:prod
```

### 6. 運行測試

要執行專案中的單元測試，請運行：

```bash
npm test
```

### 7. 使用 Docker (可選)

如果您想使用 Docker 容器化部署，可以按照以下步驟操作：

1.  **建置 Docker 映像檔：**
    ```bash
    docker build -t final898y-backend .
    ```
2.  **運行 Docker 容器：**

    ```bash
    docker run -p 3000:3000 final898y-backend
    ```

    這會將容器的 3000 埠映射到您主機的 3000 埠。

3.  **使用 Docker Compose (如果有多個服務，例如資料庫)：**
    ```bash
    docker-compose up -d
    ```
    這會根據 `docker-compose.yml` 檔案啟動所有定義的服務。

## 持續整合與部署 (CI/CD)

這個專案配置了 GitHub Actions 來實現自動化的建置和部署流程。

`final898y-tradeplatformbackend.txt` 中顯示了 GitHub Actions 的配置，它包含了兩個主要的工作 (jobs)：

- **`build` (建置)**：

  - 運行 `npm install` 安裝依賴。
  - 運行 `npm run build` 編譯專案（如果 `package.json` 中有此腳本）。
  - 運行 `npm run test` 執行單元測試（如果 `package.json` 中有此腳本）。
  - 將建置好的程式碼打包成 `release.zip`。
  - 將 `release.zip` 作為 Artifact 上傳，供後續部署使用。

- **`deploy` (部署)**：
  - 依賴於 `build` 工作成功完成。
  - 從 `build` 工作下載之前上傳的 Artifact (`node-app`，即 `release.zip`)。
  - 解壓縮 `release.zip`。
  - 登入 Azure 服務，使用預先設定的 Azure 服務主體 (Client ID, Tenant ID, Subscription ID)。
  - 將程式碼部署到 Azure Web App (此處檔案片段未包含實際部署步驟，但通常會使用 `azure/webapps-deploy@v2` 等 Actions)。

**注意**：`deploy` 工作需要正確設定 Azure 服務主體（Client ID, Tenant ID, Subscription ID）作為 GitHub Secrets。

## API 文件

本專案使用 Swagger 進行 API 文件化。在應用程式啟動後，您可以透過特定路徑（例如：`http://localhost:3000/api-docs`）訪問互動式的 API 文件，查看所有可用的 API 端點及其詳細資訊。

## 貢獻

如果您想為這個專案做出貢獻，請參考以下步驟：

1.  Fork 這個專案。
2.  建立一個新的分支 (`git checkout -b feature/your-feature-name`)。
3.  進行您的更改並提交 (`git commit -m 'Add some feature'`)。
4.  推送到分支 (`git push origin feature/your-feature-name`)。
5.  提交一個 Pull Request。

## 許可證

本專案採用 MIT License，詳見 [LICENSE.md](./LICENSE.md) 檔案。
