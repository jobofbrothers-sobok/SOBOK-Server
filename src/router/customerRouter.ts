import { Router } from "express";
import { customerController } from "../controller";
import { body } from "express-validator";
import { auth } from "../middlewares";
import multer from "multer";

const router: Router = Router();
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

// 고객 스탬프 사용신청 = POST ~/customer/delivery
router.post(
  "/delivery",
  auth,
  [
    body("reward").trim().notEmpty(),
    body("customer").trim().notEmpty(),
    body("phone").trim().notEmpty(),
    body("address").trim().notEmpty(),
    body("detailAddress").trim().notEmpty(),
    body("message").trim().notEmpty(),
  ],
  customerController.createDeliveryRequest
);

// 고객 스탬프 적립 - POST ~/customer/stamp
router.post("/stamp", auth, customerController.createStampNumber);

// 고객 스탬프 투어 참여 매장 조회 - GET ~/customer/stamp/tour?sort=value
router.get("/tour", auth, customerController.getAllTourStore);

// 고객 스탬프 적립 내역 확인 - GET ~/customer/stamp?sort=value
router.get("/stamp", auth, customerController.getAllStamp);

// 고객 유저 이름 조회 - GET ~/customer/:id
router.get("/", auth, customerController.getCustomerName);

export default router;
