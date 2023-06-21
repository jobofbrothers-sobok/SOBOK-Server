import { Router } from "express";
import { customerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 고객 스탬프 참여 매장 조회 - GET ~/customer/stamp/store?sort=value
router.get("/stamp/store", auth, customerController.getAllTourStore);

// 고객 스탬프 적립 - POST ~/customer/stamp
router.post("/stamp", auth, customerController.createStampNumber);

// 고객 스탬프 적립 내역 확인 - GET ~/customer/stamp?sort=value
router.get("/stamp", auth, customerController.getAllStamp);

// 고객 유저 생성 - POST ~/customer/signup
router.post(
  "/signup",
  [
    body("loginId").trim().notEmpty(),
    body("password").trim().notEmpty(),
    body("name").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("phone").trim().notEmpty(),
  ],
  customerController.createCustomer
);

// 고객 유저 로그인 - POST ~/customer/signin
router.post("/signin", customerController.customerSignIn);

// 고객 유저 회원탈퇴 - DELETE ~/customer/:id
router.delete("/", auth, customerController.customerDelete);

// 고객 유저 이름 조회 - GET ~/customer/:id
router.get("/", auth, customerController.getCustomerName);

// 고객 유저 회원정보 수정 - POST ~/customer/:id
router.post(
  "/",
  auth,
  [
    body("password").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("phone").trim().notEmpty(),
  ],
  customerController.updateCustomer
);

export default router;
