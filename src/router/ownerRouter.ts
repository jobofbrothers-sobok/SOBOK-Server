import { Router } from "express";
import { ownerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
// upload 미들웨어
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});
// 점주 매장소식 등록 - POST ~/owner/store/notice/:id
router.post(
  "/store/notice/:id",
  auth,
  upload.single("file"),
  [
    body("category").trim().notEmpty(),
    body("title").trim().notEmpty(),
    body("content").trim().notEmpty(),
  ],
  ownerController.createStoreNotice
);

// 점주 매장메뉴 등록 - POST ~/owner/store/menu/:id
router.post(
  "/store/menu/:id",
  auth,
  upload.single("file"),
  [body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  ownerController.createStoreMenu
);

// 점주 매장 스토어 상품 등록 - POST ~/owner/store/product/:id
router.post(
  "/store/product/:id",
  auth,
  upload.single("file"),
  [
    body("category").trim().notEmpty(),
    body("name").trim().notEmpty(),
    body("price").trim().notEmpty(),
    body("url").trim().notEmpty(),
  ],
  ownerController.createStoreProduct
);

// 점주 매장정보 등록 및 수정 - POST ~/owner/store
router.post(
  "/store",
  auth,
  upload.single("file"),
  [
    body("storeName").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("officeHour").trim().notEmpty(),
    body("dayOff").trim().notEmpty(),
    body("category").isLength({ min: 1 }),
  ],
  ownerController.createStoreInfo
);

// 점주 소복 매니저 서비스 사용 신청
router.post(
  "/alim",
  auth,
  [body("category").trim().notEmpty(), body("content").trim().notEmpty()],
  ownerController.createAlimRequest
);

// 점주 스탬프 서비스 사용 신청 - POST ~/owner/request
router.post("/stamp/request", auth, ownerController.requestStampSignIn);

// 점주 스탬프 적립 - POST ~/owner/stamp
router.post("/stamp", auth, ownerController.grantStampByRandNum);

// 점주 유저 이름 조회 - GET ~/owner/:id
router.get("/:id", ownerController.getOwnerName);

export default router;
