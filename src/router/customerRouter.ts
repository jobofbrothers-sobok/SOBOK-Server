import { Router } from "express";
import { customerController } from "../controller";
import { body } from "express-validator";

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

export default router;
