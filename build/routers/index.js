"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Home page route.
router.get("/", (req, res) => {
    res.render("index", { title: "TradePlatform", message: "Home page!" });
});
// About page route.
router.get("/about", (req, res) => {
    res.send("About The Concept");
});
exports.default = router;
