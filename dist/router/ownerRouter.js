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
// upload 미들웨어
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
// 점주 매장소식 등록 - POST ~/owner/store/notice/:id
router.post("/store/notice/:id", middlewares_1.auth, upload.single("file"), [
    (0, express_validator_1.body)("category").trim().notEmpty(),
    (0, express_validator_1.body)("title").trim().notEmpty(),
    (0, express_validator_1.body)("content").trim().notEmpty(),
], controller_1.ownerController.createStoreNotice);
// 점주 매장메뉴 등록 - POST ~/owner/store/menu/:id
router.post("/store/menu/:id", middlewares_1.auth, upload.single("file"), [(0, express_validator_1.body)("title").trim().notEmpty(), (0, express_validator_1.body)("content").trim().notEmpty()], controller_1.ownerController.createStoreMenu);
// 점주 매장 스토어 상품 등록 - POST ~/owner/store/product/:id
router.post("/store/product/:id", middlewares_1.auth, upload.single("file"), [
    (0, express_validator_1.body)("category").trim().notEmpty(),
    (0, express_validator_1.body)("name").trim().notEmpty(),
    (0, express_validator_1.body)("price").trim().notEmpty(),
    (0, express_validator_1.body)("url").trim().notEmpty(),
], controller_1.ownerController.createStoreProduct);
// 점주 매장정보 등록 및 수정 - POST ~/owner/store
router.post("/store", middlewares_1.auth, upload.single("file"), [
    (0, express_validator_1.body)("storeName").trim().notEmpty(),
    (0, express_validator_1.body)("description").trim().notEmpty(),
    (0, express_validator_1.body)("officeHour").trim().notEmpty(),
    (0, express_validator_1.body)("dayOff").trim().notEmpty(),
    (0, express_validator_1.body)("category").isLength({ min: 1 }),
], controller_1.ownerController.createStoreInfo);
// 점주 소복 매니저 서비스 사용 신청
router.post("/alim", middlewares_1.auth, [(0, express_validator_1.body)("category").trim().notEmpty(), (0, express_validator_1.body)("content").trim().notEmpty()], controller_1.ownerController.createAlimRequest);
// 점주 스탬프 서비스 사용 신청 - POST ~/owner/request
router.post("/stamp/request", middlewares_1.auth, controller_1.ownerController.requestStampSignIn);
// 점주 스탬프 적립 - POST ~/owner/stamp
router.post("/stamp", middlewares_1.auth, controller_1.ownerController.grantStampByRandNum);
// 점주 유저 이름 조회 - GET ~/owner/:id
router.get("/:id", controller_1.ownerController.getOwnerName);
exports.default = router;
//# sourceMappingURL=ownerRouter.js.map