import { Router } from "express";
import { mainController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
const reviewUpload = multer({ dest: "uploads/customer/review/" });

// 유저 근처 카페 개별 업체 정보 조회
router.get("/store/info/:id", mainController.getCafeById);

// 유저 근처 카페 개별 업체 소식 조회
router.get("/store/notice/:id", mainController.getCafeNoticeById);

// 유저 근처 카페 개별 업체 메뉴 조회
router.get("/store/menu/:id", mainController.getCafeMenuById);

// 유저 근처 카페 개별 업체 피드 조회
router.get("/store/review/:id", mainController.getCafeReviewById);

// 유저 근처 카페 개별 업체 피드 작성
router.post(
  "/store/review/:id",
  auth,
  reviewUpload.single("file"),
  [body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  mainController.createCafeReviewById
);

// 카페 찜하기
router.post("/store/:storeId", auth, mainController.createLikeCafe);

// 카페 찜 해제하기
router.delete("/store/:storeId", auth, mainController.deleteLikeCafe);

// 유저 근처 카페 전체 조회 - GET ~/main/store
router.get("/store", mainController.getAllCafe);

//* 고객 유저 마이페이지

//* 점주 유저 마이페이지
export default router;
