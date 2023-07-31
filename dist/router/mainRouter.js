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
// 유저 근처 카페 개별 업체 정보 조회
router.get("/store/info/:storeId", controller_1.mainController.getCafeById);
// 유저 근처 카페 개별 업체 소식 조회
router.get("/store/notice/:storeId", controller_1.mainController.getCafeNoticeById);
// 유저 근처 카페 개별 업체 메뉴 조회
router.get("/store/menu/:storeId", controller_1.mainController.getCafeMenuById);
// 유저 근처 카페 개별 업체 피드 조회
router.get("/store/review/:storeId", controller_1.mainController.getCafeReviewById);
// 유저 근처 카페 개별 업체 피드 작성
router.post("/store/review/:storeId", middlewares_1.auth, upload.single("file"), [(0, express_validator_1.body)("title").trim().notEmpty(), (0, express_validator_1.body)("content").trim().notEmpty()], controller_1.mainController.createCafeReviewById);
// 소복 스토어 상품 조회
router.get("/store/products", controller_1.mainController.getCafeStoreProducts);
// 카페 찜하기
router.post("/store/:storeId", middlewares_1.auth, controller_1.mainController.createLikeCafe);
// 카페 찜 해제하기
router.delete("/store/:storeId", middlewares_1.auth, controller_1.mainController.deleteLikeCafe);
// 유저 근처 카페 전체 조회 - GET ~/main/store
router.post("/store", middlewares_1.auth, controller_1.mainController.getAllCafe);
// 고객 유저 마이페이지 조회
router.post("/mypage", middlewares_1.auth, controller_1.mainController.getCustomerMyPage);
// 최고관리자 | 개별 업체 소식 삭제
router.delete("/store/notice/:noticeId", middlewares_1.auth, controller_1.mainController.deleteCafeNoticeById);
// 최고관리자 | 개별 업체 메뉴 삭제
router.delete("/store/menu/:menuId", middlewares_1.auth, controller_1.mainController.deleteCafeMenuById);
// 최고관리자 | 개별 업체 피드 삭제
router.delete("/store/review/:reviewId", middlewares_1.auth, controller_1.mainController.deleteCafeReviewById);
// 최고관리자 | 스토어 상품 삭제
router.delete("/store/products/:productId", middlewares_1.auth, controller_1.mainController.deleteCafeProductById);
// 전체 카페 소식 모아보기
router.get("/notice/all", controller_1.mainController.getAllCafeNotice);
// 찜한 카페 소식 모아보기
router.get("/notice/like", middlewares_1.auth, controller_1.mainController.getAllLikeCafeNotice);
// 공지사항 개별 조회
router.get("/notice/:noticeId", controller_1.mainController.findNoticeById);
// 공지사항 전체 조회
router.get("/notice", controller_1.mainController.getAllNotice);
// 문의사항 작성
router.post("/inquiry", middlewares_1.auth, [(0, express_validator_1.body)("title").trim().notEmpty(), (0, express_validator_1.body)("content").trim().notEmpty()], controller_1.mainController.createInquiry);
// 카페 검색
router.post("/", middlewares_1.auth, controller_1.mainController.getCafeByKeyword);
exports.default = router;
//# sourceMappingURL=mainRouter.js.map