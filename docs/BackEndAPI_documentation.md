# API 說明文件

本文件詳細描述了後端應用程式的 API 端點。

## 認證 (Auth)

### 1. 驗證 Google ID Token 並登入

- **核心功能描述**: 此 API 用於接收從前端傳來的 Google 登入後取得的 ID Token。後端會驗證此 Token 的有效性，如果驗證通過，會檢查該 Google 帳號是否已經在系統中註冊。若已註冊，則會產生一個新的 Access Token 和 Refresh Token，並將其設定在 HttpOnly 的 Cookie 中回傳給前端，完成登入流程。
- **介面位址**: `/auth/verifyGoogleIdToken`
- **方法**: `POST`
- **需要登入**: 否
- **請求參數 (Body)**:
  ```json
  {
    "credential": "YOUR_GOOGLE_ID_TOKEN",
    "g_csrf_token": "YOUR_CSRF_TOKEN"
  }
  ```
- **回應類型**: JSON

---

### 2. 取得 CSRF Token

- **核心功能描述**: 為了防止跨站請求偽造 (CSRF) 攻擊，前端在進行敏感操作（如登入、登出）前，需要先呼叫此 API 來取得一個 CSRF Token。後端會產生一個獨一無二的 Token，並將其設定在一個名為 `g_csrf_token` 的 Cookie 中，同時也會在回應的 body 中回傳此 Token。
- **介面位址**: `/auth/getCsrfToken`
- **方法**: `GET`
- **需要登入**: 否
- **請求參數**: 無
- **回應類型**: JSON

---

### 3. 刷新 Access Token

- **核心功能描述**: 當 Access Token 過期時，前端可以帶著未過期的 Refresh Token 呼叫此 API。後端會驗證 Refresh Token 的有效性，如果通過，則會產生一個新的 Access Token，並透過 Cookie 回傳，以延長使用者的登入狀態，提升使用者體驗。
- **介面位址**: `/auth/refresh`
- **方法**: `POST`
- **需要登入**: 是 (需要有效的 Refresh Token)
- **請求參數**: 無 (Token 從 Cookie 讀取)
- **回應類型**: JSON

---

### 4. 登出

- **核心功能描述**: 使用者執行登出操作。後端會驗證 CSRF Token，並從 Redis 中刪除該使用者的 Access Token 和 Refresh Token，同時清除前端儲存相關 Token 的 Cookie，完成登出。
- **介面位址**: `/auth/logout`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**:
  ```json
  {
    "mobilephone": "USER_MOBILE_PHONE",
    "g_csrf_token": "YOUR_CSRF_TOKEN"
  }
  ```
- **回應類型**: JSON

---

## 使用者 (Users)

### 1. 使用者註冊

- **核心功能描述**: 提供新使用者註冊帳號的功能。API 會接收使用者的基本資料，經過 Zod 驗證格式後，將密碼進行雜湊加密，然後存入資料庫。此 API 會檢查手機號碼是否已經被註冊，以確保其唯一性。
- **介面位址**: `/users/register`
- **方法**: `POST`
- **需要登入**: 否
- **請求參數 (Body)**:
  ```json
  {
    "Name": "John Doe",
    "MobilePhone": "0912345678",
    "Email": "john.doe@example.com",
    "Password": "your_strong_password",
    "Birthday": "1990-01-01T00:00:00.000Z",
    "Address": "Your Address",
    "StoreName": "Your Store"
  }
  ```
- **回應類型**: JSON

---

### 2. 使用者登入

- **核心功能描述**: 驗證使用者提供的帳號（手機號碼）和密碼。如果驗證成功，會產生 JWT Access Token 和 Refresh Token，存入 Redis 並透過 Cookie 回傳給前端，完成登入。
- **介面位址**: `/users/login`
- **方法**: `POST`
- **需要登入**: 否
- **請求參數 (Body)**:
  ```json
  {
    "MobilePhone": "0912345678",
    "Password": "your_password"
  }
  ```
- **回應類型**: JSON

---

### 3. 編輯使用者資料

- **核心功能描述**: 允許已登入的使用者更新自己的個人資料。此 API 受 `authenticateToken` 中介軟體保護，確保只有本人才能修改。使用者可以部分更新其姓名、Email、生日、地址等資訊。
- **介面位址**: `/users/edit`
- **方法**: `PUT`
- **需要登入**: 是
- **請求參數 (Query)**: `uid={USER_UUID}`
- **請求參數 (Body)**:
  ```json
  {
    "Name": "Johnathan Doe",
    "Email": "johnathan.doe@example.com"
  }
  ```
- **回應類型**: JSON

---

### 4. 查詢單一使用者詳細資料

- **核心功能描述**: 根據使用者 UUID 查詢特定使用者的詳細公開資訊。
- **介面位址**: `/users/search`
- **方法**: `GET`
- **需要登入**: 否
- **請求參數 (Query)**: `uid={USER_UUID}`
- **回應類型**: JSON

---

## 商品 (Products)

### 1. 取得所有商品列表（分頁、篩選、搜尋）

- **核心功能描述**: 獲取平台上的商品列表。此 API 支援多種查詢參數，包括分頁（`page`, `pageSize`）、依分類/子分類篩選（`categoryId`, `subCategoryId`）以及關鍵字搜尋（`search`）。這使其能靈活應對各種商品展示需求，從全部商品瀏覽到精準搜尋。
- **介面位址**: `/products/getallproducts`
- **方法**: `GET`
- **需要登入**: 否
- **請求參數 (Query)**:
  - `page` (optional): 頁碼
  - `pageSize` (optional): 每頁數量
  - `categoryId` (optional): 分類 ID
  - `subCategoryId` (optional): 子分類 ID
  - `search` (optional): 搜尋關鍵字
- **回應類型**: JSON

---

### 2. 根據 ID 取得單一商品詳細資訊

- **核心功能描述**: 透過提供商品 ID，取得該項商品的完整詳細資訊，包含名稱、價格、描述、庫存、圖片等。主要用於商品詳情頁的資料載入。
- **介面位址**: `/products/getproductbyid/{id}`
- **方法**: `GET`
- **需要登入**: 否
- **請求參數 (Path)**: `id` (商品 ID)
- **回應類型**: JSON

---

### 3. 取得所有商品分類與子分類

- **核心功能描述**: 一次性獲取所有商品的主分類及其對應的子分類列表。這個 API 非常適合用於建立商品分類導覽選單或篩選器，讓使用者可以方便地按分類瀏覽商品。
- **介面位址**: `/products/getcategories`
- **方法**: `GET`
- **需要登入**: 否
- **請求參數**: 無
- **回應類型**: JSON

---

## 購物車 (Cart)

### 1. 將商品加入購物車

- **核心功能描述**: 允許登入的使用者將指定數量的特定商品加入到自己的購物車中。後端會檢查商品庫存是否足夠，如果購物車中已存在相同商品，則會累加數量；如果不存在，則會新增一筆新的購物車項目。
- **介面位址**: `/carts/addToCart`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**:
  ```json
  {
    "userUuid": "USER_UUID",
    "productId": 123,
    "quantity": 1
  }
  ```
- **回應類型**: JSON

---

### 2. 更新購物車中商品的數量

- **核心功能描述**: 讓使用者可以修改購物車中某個已存在商品的數量。例如，在購物車頁面，使用者可以將商品數量從 1 增加到 3。
- **介面位址**: `/carts/updateCartItem`
- **方法**: `PUT`
- **需要登入**: 是
- **請求參數 (Body)**:
  ```json
  {
    "userUuid": "USER_UUID",
    "productId": 123,
    "quantity": 3
  }
  ```
- **回應類型**: JSON

---

### 3. 從購物車中刪除一項商品

- **核心功能描述**: 根據商品 ID，將特定商品從使用者的購物車中完全移除。
- **介面位址**: `/carts/{productId}`
- **方法**: `DELETE`
- **需要登入**: 是
- **請求參數 (Path)**: `productId` (商品 ID)
- **請求參數 (Query)**: `userUuid` (使用者 UUID)
- **回應類型**: JSON

---

### 4. 清空購物車

- **核心功能描述**: 一次性刪除使用者購物車中的所有商品項目，提供一個快速清空購物車的便利操作。
- **介面位址**: `/carts/clearCart`
- **方法**: `DELETE`
- **需要登入**: 是
- **請求參數 (Query)**: `userUuid` (使用者 UUID)
- **回應類型**: JSON

---

### 5. 取得購物車內容

- **核心功能描述**: 獲取使用者當前購物車中的所有商品列表及其詳細資訊（如商品名稱、價格、數量、圖片等）。這是購物車頁面顯示資料的核心 API。
- **介面位址**: `/carts/getCart`
- **方法**: `GET`
- **需要登入**: 是
- **請求參數 (Query)**: `userUuid` (使用者 UUID)
- **回應類型**: JSON

---

## 結帳與付款 (Checkout & Pay)

### 1. 從購物車建立訂單

- **核心功能描述**: 這是結帳流程的核心步驟。API 會根據使用者當前的購物車內容，建立一筆新的訂單。它會執行一系列資料庫交易操作：鎖定庫存、計算總金額、建立訂單主記錄與訂單項目，最後清空購物車。整個過程在一個資料庫交易中完成，確保資料一致性。
- **介面位址**: `/checkoutflow/createOrderFromCart`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**:
  ```json
  {
    "userUuid": "USER_UUID",
    "shipping_address": "Delivery Address",
    "recipient_name": "Recipient Name",
    "recipient_phone": "0911222333",
    "recipient_email": "recipient@email.com",
    "payment_method": "ecpay"
  }
  ```
- **回應類型**: JSON

---

### 2. 根據訂單編號查詢訂單

- **核心功能描述**: 根據訂單編號查詢特定訂單的完整資訊，包含訂單狀態、運送資訊，以及訂單內所有商品的詳細資料（商品名稱、ID、訂購數量、單價）。
- **介面位址**: `/checkoutflow/order/{orderNumber}`
- **方法**: `GET`
- **需要登入**: 是
- **請求參數 (Path)**: `orderNumber` (訂單編號)
- **回應類型**: JSON

---

### 2. ECPay - 取得結帳參數

- **核心功能描述**: 當使用者選擇使用 ECPay 付款時，前端需呼叫此 API 以取得向 ECPay 伺服器發起結帳請求所需的參數。後端會根據訂單資訊和 ECPay 的規則，產生一個包含 `MerchantTradeNo` 和 `CheckMacValue` 的物件，前端可利用這些參數來建立自動提交至 ECPay 的表單。
- **介面位址**: `/pay/ecpay/getcheckout`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**: ECPay 前端輸入模型 (`ecPayFrountendInput`)
- **回應類型**: JSON

---

### 3. ECPay - 接收付款結果通知

- **核心功能描述**: 此 API 是提供給 ECPay 伺服器在使用者完成付款後，非同步通知我方系統付款結果的回調 (Callback) 端點。後端會驗證收到的 `CheckMacValue` 以確保請求來自 ECPay，驗證成功後會回傳 `1|OK`，並在背景更新對應訂單的付款狀態。
- **介面位址**: `/pay/ecpay/getpayresult`
- **方法**: `POST`
- **需要登入**: 否 (由 ECPay 系統呼叫)
- **請求參數 (Body)**: ECPay 付款結果 (`PaymentResult`)
- **回應類型**: string (`1|OK` 或錯誤訊息)

---

### 4. LINE Pay - 發起付款請求

- **核心功能描述**: 當使用者選擇 LINE Pay 付款時，前端呼叫此 API。後端會向 LINE Pay 伺服器發起一個 "Request" API 呼叫，如果成功，LINE Pay 會回傳一個付款頁面的網址 (`paymentUrl.web`)。後端再將此網址回傳給前端，前端需將使用者重導向至此網址以進行付款。
- **介面位址**: `/pay/linepay/paymentRequest`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**: LINE Pay 前端輸入模型 (`linepayPRFrountendInputSchema`)
- **回應類型**: string (LINE Pay 付款頁面網址)

---

### 5. LINE Pay - 確認付款

- **核心功能描述**: 使用者在 LINE Pay 付款頁面完成操作後，會被導回前端指定的 `confirmUrl`，並附帶 `transactionId` 和 `orderId`。前端接著呼叫此 API，後端會帶著這些資訊向 LINE Pay 伺服器發起 "Confirm" API 呼叫，以最終確認並完成這筆交易。
- **介面位址**: `/pay/linepay/paymentConfirm`
- **方法**: `POST`
- **需要登入**: 是
- **請求參數 (Body)**:
  ```json
  {
    "transactionId": "LINE_PAY_TRANSACTION_ID",
    "orderId": "YOUR_ORDER_ID"
  }
  ```
- **回應類型**: string (交易金額)

---

## JSDoc 註解

### `services/authService.ts`

```typescript
/**
 * @async
 * @function getCsrfToken
 * @description 產生一個用於防止 CSRF 攻擊的隨機 Token。
 * @returns {Promise<ItransportResult<string>>} 回傳一個包含 CSRF Token 的 transport 結果物件。
 */

/**
 * @async
 * @function CheckDoubleSubmitCSRF
 * @description 驗證客戶端提交的 CSRF Token 是否與 Cookie 中的一致 (Double Submit Cookie 模式)。
 * @param {unknown} csrfFromCookie - 從請求的 Cookie 中獲取的 CSRF Token。
 * @param {string} csrfFromBody - 從請求的 Body 中獲取的 CSRF Token。
 * @returns {Promise<ItransportResult<string>>} 回傳驗證結果的 transport 物件。
 */

/**
 * @async
 * @function createAccessAndRefreshToken
 * @description 根據使用者的手機和 Email，產生一組新的 Access Token 和 Refresh Token。
 * @param {string} mobilephone - 使用者手機號碼。
 * @param {string} email - 使用者 Email。
 * @returns {Promise<ItransportResult<authModel.AccessAndRefreshToken>>} 回傳包含新 Token 的 transport 結果物件。
 */

/**
 * @async
 * @function verifyToken
 * @description 驗證 Access Token 和 Refresh Token 的有效性。如果 Access Token 有效，直接回傳成功。如果 Access Token 失效但 Refresh Token 有效，則產生一個新的 Access Token。
 * @param {string} accessToken - 從客戶端來的 Access Token。
 * @param {string} refreshToken - 從客戶端來的 Refresh Token。
 * @returns {Promise<ItransportResult<string>>} 如果驗證成功，data 中可能包含原始或新的 Access Token。
 */
```

### `controllers/AuthController.ts`

```typescript
/**
 * @async
 * @function getCsrfToken
 * @description Express Controller: 處理獲取 CSRF Token 的請求。呼叫 authService 產生 Token，並將其設定到 Cookie 及回應中。
 * @param {Request} req - Express Request 物件。
 * @param {Response} res - Express Response 物件。
 * @param {NextFunction} next - Express NextFunction 物件。
 */

/**
 * @async
 * @function refresh
 * @description Express Controller: 處理刷新 Access Token 的請求。從 Cookie 中讀取 Token，並呼叫 authService 進行驗證與刷新。
 * @param {Request} req - Express Request 物件。
 * @param {Response} res - Express Response 物件。
 * @param {NextFunction} next - Express NextFunction 物件。
 */

/**
 * @async
 * @function logout
 * @description Express Controller: 處理使用者登出請求。驗證 CSRF Token，並清除伺服器端(Redis)和客戶端(Cookie)的 Token。
 * @param {Request} req - Express Request 物件。
 * @param {Response} res - Express Response 物件。
 * @param {NextFunction} next - Express NextFunction 物件。
 */
```
