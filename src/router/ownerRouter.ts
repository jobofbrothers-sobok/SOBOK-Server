import { Router } from "express";
import { ownerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
const storeUpload = multer({ dest: "uploads/owner/store/" });
const noticeUpload = multer({ dest: "uploads/owner/store/notice/" });
const menuUpload = multer({ dest: "uploads/owner/store/menu/" });
const productUpload = multer({ dest: "uploads/owner/store/product/" });

// 점주 매장소식 등록 - POST ~/owner/store/notice
router.post(
  "/store/notice/:id",
  auth,
  noticeUpload.single("file"),
  [
    body("category").trim().notEmpty(),
    body("title").trim().notEmpty(),
    body("content").trim().notEmpty(),
  ],
  ownerController.createStoreNotice
);

// 점주 매장메뉴 등록 - POST ~/owner/store/menu
router.post(
  "/store/menu/:id",
  auth,
  menuUpload.single("file"),
  [body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  ownerController.createStoreMenu
);

// 점주 매장 스토어 상품 등록 - POST ~/owner/store/product
router.post(
  "/store/product/:id",
  auth,
  productUpload.single("file"),
  [
    body("category").trim().notEmpty(),
    body("name").trim().notEmpty(),
    body("price").trim().notEmpty(),
  ],
  ownerController.createStoreProduct
);

// 점주 매장정보 수정 - POST ~/owner/store/info/:id
router.post(
  "/store/:id",
  auth,
  storeUpload.single("file"),
  [
    body("storeName").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("officeHour").trim().notEmpty(),
    body("dayOff").trim().notEmpty(),
    body("category").isLength({ min: 1 }),
  ],
  ownerController.updateStoreInfo
);

// 점주 매장정보 등록 - POST ~/owner/store/info
router.post(
  "/store",
  auth,
  storeUpload.single("file"),
  [
    body("storeName").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("officeHour").trim().notEmpty(),
    body("dayOff").trim().notEmpty(),
    body("category.*").isString().trim(),
  ],
  ownerController.createStoreInfo
);

// 점주 소복 매니저 서비스 사용 신청
router.post("/alim", auth, ownerController.createAlimRequest);

// 점주 스탬프 적립 - POST ~/owner/stamp
router.post("/stamp", auth, ownerController.grantStampByRandNum);

// // 점주 스탬프 서비스 사용 신청 - POST ~/owner/request
// router.post("/request", auth, ownerController.requestStampSignIn);

// // 점주 유저 회원정보 수정 - POST ~/owner/:id
// router.post(
//   "/:id",
//   [
//     body("password").trim().notEmpty(),
//     body("director").trim().notEmpty(),
//     body("phone").trim().notEmpty(),
//     body("email").trim().notEmpty(),
//     body("address").trim().notEmpty(),
//     body("detailAddress").trim().notEmpty(),
//     body("licenseNumber").trim().notEmpty(),
//     body("licenseImage").trim().notEmpty(),
//   ],
//   ownerController.updateOwner
// );

// 점주 유저 이름 조회 - GET ~/owner/:id
router.get("/:id", ownerController.getOwnerName);

export default router;
