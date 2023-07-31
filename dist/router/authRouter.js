"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
// import { upload } from "../middlewares";
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
// 고객 유저 회원가입
router.post("/signup/customer", [
    (0, express_validator_1.body)("loginId").trim().notEmpty(),
    (0, express_validator_1.body)("password").trim().notEmpty(),
    (0, express_validator_1.body)("name").trim().notEmpty(),
    (0, express_validator_1.body)("email").trim().notEmpty(),
    (0, express_validator_1.body)("phone").trim().notEmpty(),
], controller_1.authController.createCustomer);
// 회원가입 시 유저 아이디 중복확인
router.post("/signup/check", controller_1.authController.checkLoginId);
// 점주 유저 회원가입 1 (loginId, 사진)
router.post("/signup/owner", 
// [body("loginId").notEmpty()],
upload.single("file"), controller_1.authController.createOwner);
// 점주 유저 회원가입 2(loginId, 나머지 필드)
router.patch("/signup/owner", [
    (0, express_validator_1.body)("loginId").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("store").notEmpty(),
    (0, express_validator_1.body)("director").notEmpty(),
    (0, express_validator_1.body)("phone").notEmpty(),
    (0, express_validator_1.body)("email").notEmpty(),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("licenseNumber").notEmpty(),
], controller_1.authController.patchOwner);
// 고객 유저 회원정보 수정
router.post("/update/customer", middlewares_1.auth, upload.single("file"), [
    (0, express_validator_1.body)("password").trim().notEmpty(),
    (0, express_validator_1.body)("email").trim().notEmpty(),
    (0, express_validator_1.body)("phone").trim().notEmpty(),
], controller_1.authController.customerUpdate);
// 점주 유저 회원정보 수정
router.post("/update/owner", middlewares_1.auth, upload.fields([{ name: "file1" }, { name: "file2" }]), [
    (0, express_validator_1.body)("password").trim().notEmpty(),
    (0, express_validator_1.body)("director").trim().notEmpty(),
    (0, express_validator_1.body)("phone").trim().notEmpty(),
    (0, express_validator_1.body)("email").trim().notEmpty(),
    (0, express_validator_1.body)("address").trim().notEmpty(),
    (0, express_validator_1.body)("detailAddress").trim().notEmpty(),
    (0, express_validator_1.body)("licenseNumber").trim().notEmpty(),
], controller_1.authController.ownerUpdate);
// 고객 유저 로그인
router.post("/signin/customer", controller_1.authController.customerSignIn);
// 점주 유저 로그인
router.post("/signin/owner", controller_1.authController.ownerSignIn);
// // 고객 유저 로그아웃
// router.get("/signout/customer", auth, authController.customerSignOut);
// 고객 유저 회원정보 찾기 및 비밀번호 재설정
router.post("/find/customer", controller_1.authController.findCustomerByEmail);
// 점주 유저 회원정보 찾기 및 비밀번호 재설정
router.post("/find/owner", controller_1.authController.findOwnerByEmail);
// 고객 유저 회원탈퇴
router.delete("/customer", middlewares_1.auth, controller_1.authController.customerDelete);
// 점주 유저 회원탈퇴
router.delete("/owner", middlewares_1.auth, controller_1.authController.ownerDelete);
exports.default = router;
//# sourceMappingURL=authRouter.js.map