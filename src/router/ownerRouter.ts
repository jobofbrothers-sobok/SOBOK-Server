import { Router } from "express";
import { ownerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";

const router: Router = Router();

// 점주 매장소식 등록 - POST ~/owner/store/notice
router.post("/store/notice", auth, ownerController.createStoreNotice);

// 점주 매장메뉴 등록 - POST ~/owner/store/menu
router.post("/store/menu", auth, ownerController.createStoreMenu);

// 점주 매장 스토어 상품 등록 - POST ~/owner/store/product
router.post("/store/product", auth, ownerController.createStoreProduct);

// 점주 매장정보 수정 - POST ~/owner/store/info/:id
router.post("/store/:id", auth, ownerController.updateStoreInfo);

// 점주 매장정보 등록 - POST ~/owner/store/info
router.post("/store", auth, ownerController.createStoreInfo);

// 점주 스탬프 적립 - POST ~/owner/stamp
router.post("/stamp", auth, ownerController.grantStampByRandNum);

// // 점주 스탬프 서비스 사용 신청 - POST ~/owner/request
// router.post("/request", auth, ownerController.requestStampSignIn);

// 점주 유저 생성 - POST ~/owner/signup
router.post(
  "/signup",
  [
    body("loginId").trim().notEmpty(),
    body("password").trim().notEmpty(),
    body("store").trim().notEmpty(),
    body("director").trim().notEmpty(),
    body("phone").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("address").trim().notEmpty(),
    body("licenseNumber").trim().notEmpty(),
    body("licenseImage").trim().notEmpty(),
  ],
  ownerController.createOwner
);

// 점주 유저 로그인 - POST ~/owner/signin
router.post("/signin", ownerController.ownerSignIn);

// 점주 유저 회원정보 수정 - POST ~/owner/:id
router.post(
  "/:id",
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
  ownerController.updateOwner
);

// 점주 유저 회원탈퇴 - DELETE ~/owner
router.delete("/", auth, ownerController.ownerDelete);

// 점주 유저 이름 조회 - GET ~/owner/:id
router.get("/:id", ownerController.getOwnerName);

export default router;
