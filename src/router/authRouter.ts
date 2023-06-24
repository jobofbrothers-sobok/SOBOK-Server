import { Router } from "express";
import { authController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
const customerUpload = multer({ dest: "uploads/customer/" });
const ownerUpload = multer({ dest: "uploads/owner/" });

// 유저 회원가입
router.post("/signup", authController.userSignUp);

// 유저 로그인
router.post("/signin", authController.userSignIn);

// 고객 유저 회원정보 수정
router.post(
  "/update/customer",
  auth,
  customerUpload.single("file"),
  [
    body("password").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("phone").trim().notEmpty(),
  ],
  authController.customerUpdate
);

// 점주 유저 회원정보 수정
router.post(
  "/update/owner",
  auth,
  ownerUpload.single("file"),
  [
    body("password").trim().notEmpty(),
    body("director").trim().notEmpty(),
    body("phone").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("address").trim().notEmpty(),
    body("detailAddress").trim().notEmpty(),
    body("licenseNumber").trim().notEmpty(),
  ],
  authController.ownerUpdate
);

export default router;
