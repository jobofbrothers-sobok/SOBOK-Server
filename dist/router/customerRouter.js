"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
});
// 고객 스탬프 사용신청 = POST ~/customer/delivery
router.post("/delivery", middlewares_1.auth, [
    (0, express_validator_1.body)("reward").trim().notEmpty(),
    (0, express_validator_1.body)("customer").trim().notEmpty(),
    (0, express_validator_1.body)("phone").trim().notEmpty(),
    (0, express_validator_1.body)("address").trim().notEmpty(),
    (0, express_validator_1.body)("detailAddress").trim().notEmpty(),
    (0, express_validator_1.body)("message").trim().notEmpty(),
], controller_1.customerController.createDeliveryRequest);
// 고객 스탬프 적립 - POST ~/customer/stamp
router.post("/stamp", middlewares_1.auth, controller_1.customerController.createStampNumber);
// 고객 스탬프 투어 참여 매장 조회 - GET ~/customer/stamp/tour?sort=value
router.get("/tour", middlewares_1.auth, controller_1.customerController.getAllTourStore);
// 고객 스탬프 적립 내역 확인 - GET ~/customer/stamp?sort=value
router.get("/stamp", middlewares_1.auth, controller_1.customerController.getAllStamp);
// 고객 유저 이름 조회 - GET ~/customer/:id
router.get("/", middlewares_1.auth, controller_1.customerController.getCustomerName);
exports.default = router;
//# sourceMappingURL=customerRouter.js.map