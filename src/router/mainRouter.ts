import { Router } from "express";
import { mainController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 유저 근처 카페 개별 업체 정보 조회
router.get("/store/info/:id", auth, mainController.getCafeById);

// 유저 근처 카페 개별 업체 소식 조회
router.get("/store/notice/:id", auth, mainController.getCafeNoticeById);

// 유저 근처 카페 개별 업체 메뉴 조회
router.get("/store/menu/:id", auth, mainController.getCafeMenuById);

// 유저 근처 카페 개별 업체 피드 조회
router.get("/store/review/:id", auth, mainController.getCafeReviewById);

// 유저 근처 카페 전체 조회 - GET ~/main/store
router.get("/store", auth, mainController.getAllCafe);

//* 고객 유저 마이페이지

//* 점주 유저 마이페이지
export default router;
