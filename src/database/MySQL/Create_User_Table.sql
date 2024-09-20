USE TradePlatform;

DROP TABLE IF EXISTS User;

CREATE TABLE User  (
  UID CHAR(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用戶唯一ID',
  Name VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用戶姓名',
  MobilePhone CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用戶手機',
  Email VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用戶電子信箱',
  Password CHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用戶密碼',
  UserStatus TINYINT NOT NULL DEFAULT 0 COMMENT '用戶狀態：0為未開通(預設)，1為已開通，2為已停權',
  Birthday DATETIME NOT NULL COMMENT '用戶出生日期',
  Address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '用戶地址',
  StoreName VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '用戶商店名稱',
  CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdateDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (UID) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;