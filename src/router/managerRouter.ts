import { Router } from "express";
import { managerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 최고관리자 로그인
router.post("/signin", managerController.managerSignin);

export default router;
