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

// 매장정보를 투어에 추가
router.post("/tour/store", auth, managerController.createTourIdForStore);

// 최고관리자 투어 추가
router.post(
  "/tour",
  auth,
  [
    body("keyword").trim().notEmpty(),
    body("title").trim().notEmpty(),
    body("reward").trim().notEmpty(),
  ],
  managerController.createTour
);

// 최고관리자 배송신청 리스트 개별 조회
router.get("/delivery/:id", auth, managerController.getDeliveryRequestById);

// 최고관리자 배송신청 리스트 전체 조회
router.get("/delivery", auth, managerController.getAllDeliveryRequest);

export default router;
