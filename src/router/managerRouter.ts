import { Router } from "express";
import { managerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 최고관리자 회원가입
router.post("/signup", managerController.managerSignup);

// 최고관리자 로그인
router.post("/signin", managerController.managerSignin);

// 점주 회원가입 승인
router.post("/grant/:id", auth, managerController.grantOwnerSignUp);

export default router;
