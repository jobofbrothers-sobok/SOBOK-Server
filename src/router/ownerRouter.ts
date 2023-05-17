import { Router } from "express";
import { ownerController } from "../controller";
import { body } from "express-validator";

const router: Router = Router();

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

// 점주 유저 회원탈퇴 - DELETE ~/owner/:id
router.delete("/:id", ownerController.ownerDelete);

export default router;
