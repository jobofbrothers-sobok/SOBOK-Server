import { Router } from "express";
import { authController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 유저 회원가입
router.post("/signup", authController.userSignUp);

// 유저 로그인
router.post("/signin", authController.userSignIn);

export default router;
