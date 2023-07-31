"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerRouter_1 = __importDefault(require("./customerRouter"));
const ownerRouter_1 = __importDefault(require("./ownerRouter"));
const managerRouter_1 = __importDefault(require("./managerRouter"));
const mainRouter_1 = __importDefault(require("./mainRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const router = (0, express_1.Router)();
router.use("/api/auth", authRouter_1.default);
router.use("/api/customer", customerRouter_1.default);
router.use("/api/owner", ownerRouter_1.default);
router.use("/api/manager", managerRouter_1.default);
router.use("/api/main", mainRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map