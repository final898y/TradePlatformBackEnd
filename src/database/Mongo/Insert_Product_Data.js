//mongodb://localhost:27017/
//mongosh $MDB_CONNECTION_STRING;
// use('myNewDatabase')
// db.myCollection.insertOne( { _id:10,x: 3 } );
use("TradePlatform");

db.Product.insertMany(
    [
        {
            _id: "PID2024080817555212345678",
            UID: "UID2024080817555212345678",
            Name: "RX-78-2 初鋼",
            ProductCategory: "鋼彈模型",
            Price: 980,
            ProductStatus: 0,
            TotalQTY: 5,
            SaleQTY: 2,
            PhotoURL: "http://example.com/imageA.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345679",
            UID: "UID2024080817555212345679",
            Name: "PS5 惡魔靈魂",
            ProductCategory: "PS5遊戲",
            Price: 800,
            ProductStatus: 2,
            TotalQTY: 1,
            SaleQTY: 1,
            PhotoURL: "http://example.com/imageB.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345670",
            UID: "UID2024080817555212345670",
            Name: "生死格鬥 滑鼠墊 巨乳",
            ProductCategory: "周邊商品",
            Price: 1400,
            ProductStatus: 3,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageD.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345110",
            UID: "UID2024080817555212311111",
            Name: "PS5",
            ProductCategory: "遊戲主機",
            Price: 14000,
            ProductStatus: 1,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageE.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345121",
            UID: "UID2024080817555212311111",
            Name: "PS5 PRO",
            ProductCategory: "遊戲主機",
            Price: 24000,
            ProductStatus: 0,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageF.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345123",
            UID: "UID2024080817555212311111",
            Name: "NS2 PRO",
            ProductCategory: "遊戲主機",
            Price: 18000,
            ProductStatus: 0,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageG.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345124",
            UID: "UID2024080817555212311111",
            Name: "Razer Wolverine V3 Pro遊戲把手",
            ProductCategory: "周邊商品",
            Price: 5000,
            ProductStatus: 2,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageH.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345144",
            UID: "UID2024080817555212311111",
            Name: "黑神話：悟空",
            ProductCategory: "CHINA NO1",
            Price: 10,
            ProductStatus: 1,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageI.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345125",
            UID: "UID2024080817555212311111",
            Name: "暗黑破壞神 4",
            ProductCategory: "PS5遊戲",
            Price: 100,
            ProductStatus: 1,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageJ.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345126",
            UID: "UID2024080817555212311111",
            Name: "鋼彈創壞者 4",
            ProductCategory: "PS5遊戲",
            Price: 1000,
            ProductStatus: 1,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageK.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
        {
            _id: "PID2024080817555212345127",
            UID: "UID2024080817555212311111",
            Name: "敘事鋼彈Ver.ka",
            ProductCategory: "鋼彈模型",
            Price: 1000,
            ProductStatus: 1,
            TotalQTY: 100,
            SaleQTY: 10,
            PhotoURL: "http://example.com/imageL.jpg",
            CreateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
            UpdateDate: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        },
    ]
);
db.Product.createIndex(
    { UID: "text", Name: "text", ProductCategory: "text"},
    {
        name: "ProductTextIndex",
    }
);
