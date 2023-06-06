import { Router } from "express";
import { customerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

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

// 고객 유저 회원정보 수정 - POST ~/customer/:id
router.post(
  "/:id",
  [
    body("password").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("phone").trim().notEmpty(),
  ],
  customerController.updateCustomer
);

// 고객 유저 회원탈퇴 - DELETE ~/customer/:id
router.delete("/:id", customerController.customerDelete);

// 고객 유저 이름 조회 - GET ~/customer/:id
router.get("/:id", customerController.getCustomerName);

export default router;
