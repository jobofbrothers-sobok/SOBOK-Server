import { Router } from "express";
import { authController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
const customerUpload = multer({ dest: "uploads/customer/" });
const ownerUpload = multer({ dest: "uploads/owner/" });

// 고객 유저 회원가입
router.post(
  "/signup/customer",
  [
    body("loginId").trim().notEmpty(),
    body("password").trim().notEmpty(),
    body("name").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("phone").trim().notEmpty(),
  ],
  authController.createCustomer
);

// 점주 유저 회원가입
router.post(
  "/signup/owner",
  // [
  //   body("loginId").trim().notEmpty(),
  //   body("password").trim().notEmpty(),
  //   body("store").trim().notEmpty(),
  //   body("director").trim().notEmpty(),
  //   body("phone").trim().notEmpty(),
  //   body("email").trim().notEmpty(),
  //   body("address").trim().notEmpty(),
  //   body("licenseNumber").trim().notEmpty(),
  // ],
  ownerUpload.single("file"),
  authController.createOwner
);

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
    body("licenseImage").trim().notEmpty(),
  ],
  authController.ownerUpdate
);

// 유저 로그인
router.post("/signin", authController.userSignIn);

// 고객 유저 회원탈퇴
router.delete("/customer/:id", auth, authController.customerDelete);

// 점주 유저 회원탈퇴
router.delete("/owner/:id", auth, authController.ownerDelete);

export default router;
