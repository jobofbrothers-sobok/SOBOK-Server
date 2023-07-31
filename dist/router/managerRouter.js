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
// 점주 회원가입 승인
router.post("/grant/:id", middlewares_1.auth, controller_1.managerController.grantOwnerSignUp);
// 최고관리자 담당자(점주) 정보 개별 조회
router.get("/owner/:id", middlewares_1.auth, controller_1.managerController.getOwnerById);
// 최고관리자 담당자(점주) 정보 전체 조회
router.get("/owner", middlewares_1.auth, controller_1.managerController.getAllOwner);
// 최고관리자 스탬프 사용 신청 담당자 개별 조회
router.get("/stamp/:id", middlewares_1.auth, controller_1.managerController.getStampSignInRequest);
// 최고관리자 스탬프 사용 신청 승인
router.post("/stamp/:id", middlewares_1.auth, controller_1.managerController.stampSignInGrant);
// 최고관리자 스탬프 사용 신청 담당자 전체 조회
router.get("/stamp", middlewares_1.auth, controller_1.managerController.getAllStampSignInRequest);
// 최고관리자 고객 정보 개별 조회
router.get("/client/:id", middlewares_1.auth, controller_1.managerController.getCustomerById);
// 최고관리자 고객 정보 전체 조회
router.get("/client", middlewares_1.auth, controller_1.managerController.getAllCustomer);
// 최고관리자 배송신청 리스트 개별 조회
router.get("/delivery/:id", middlewares_1.auth, controller_1.managerController.getDeliveryRequestById);
// 최고관리자 배송신청 리스트 전체 조회
router.get("/delivery", middlewares_1.auth, controller_1.managerController.getAllDeliveryRequest);
// 최고관리자 투어 추가 시 매장 검색
router.post("/tour/search", middlewares_1.auth, controller_1.managerController.getStoreByStoreName);
// 최고관리자 투어 추가
router.post("/tour", middlewares_1.auth, upload.single("file"), [
    (0, express_validator_1.body)("keyword").trim().notEmpty(),
    (0, express_validator_1.body)("title").trim().notEmpty(),
    (0, express_validator_1.body)("reward").trim().notEmpty(),
    (0, express_validator_1.body)("cafeList").isLength({ min: 1 }),
], controller_1.managerController.createTour);
// 최고관리자 스탬프 정보 조회 (스템프 정보 리스트 조회)
router.get("/tour", middlewares_1.auth, controller_1.managerController.getAllTour);
// // 최고관리자 회원가입
// router.post("/signup", managerController.managerSignup);
// // 최고관리자 로그인
// router.post("/signin", managerController.managerSignin);
// 최고관리자 소복 매니저 신청 리스트 개별 조회
router.get("/alim/:id", middlewares_1.auth, controller_1.managerController.getAlimRequestById);
// 최고관리자 소복 매니저 신청 리스트 전체 조회
router.get("/alim", middlewares_1.auth, controller_1.managerController.getAllAlimRequest);
// 최고관리자 소복 매니저 문자 일괄전송
router.post("/message", middlewares_1.auth, controller_1.managerController.sendMessage);
// 최고관리자 소복 매니저 카카오톡 일괄전송(친구톡)
router.post("/kakao", middlewares_1.auth, controller_1.managerController.sendKakao);
// 최고관리자 문의사항 조회
router.get("/inquiry", middlewares_1.auth, controller_1.managerController.getAllInquiry);
// 최고관리자 공지글 작성
router.post("/", middlewares_1.auth, upload.single("file"), controller_1.managerController.createNotice);
exports.default = router;
//# sourceMappingURL=managerRouter.js.map