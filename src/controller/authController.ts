import { Request, Response } from "express";
import { authService } from "../service";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { CustomerUpdateDTO } from "../interfaces/user/customerUpdateDTO";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { OwnerUpdateDTO } from "../interfaces/user/ownerUpdateDTO";
import session from "express-session";
import { auth } from "../middlewares";
import router from "../router";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Customer, Store_Owner } from "@prisma/client";

// 고객 유저 회원가입
const createCustomer = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const customerCreateDTO: CustomerCreateDTO = req.body;
  const termsAgree = req.body.termsAgree;

  if (!termsAgree) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const data = await authService.createCustomer(customerCreateDTO);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
    }

    // jwtHandler 내 sign 함수를 이용해 accessToken 생성
    const accessToken = jwtHandler.sign(data.id);

    const result = {
      userId: data.id,
      name: data.name,
      accessToken,
    };

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result));
  } catch (e) {
    console.log(e);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 회원가입 1
const createOwner = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const image: Express.Multer.File = req.file as Express.Multer.File;
    const path = image.path;
    console.log(path);
    const ownerCreateDTO: OwnerCreateDTO = req.body;
    const loginId = ownerCreateDTO.loginId;
    // const password = ownerCreateDTO.password;
    // const store = ownerCreateDTO.store;
    // const director = ownerCreateDTO.director;
    // const phone = ownerCreateDTO.phone;
    // const email = ownerCreateDTO.email;
    // const address = ownerCreateDTO.address;
    // const licenseNumber = ownerCreateDTO.licenseNumber;
    // const termsAgree = req.body.termsAgree;
    if (
      !loginId
      // !password ||
      // !store ||
      // !director ||
      // !phone ||
      // !email ||
      // !address ||
      // !licenseNumber
    ) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    console.log("create");
    console.log(typeof loginId, typeof path);
    const data = await authService.createOwner(ownerCreateDTO, path);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.OWNER_SIGNUP_1_FAIL));
    }

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.OWNER_SIGNUP_1_SUCCESS, data));
  } catch (e) {
    console.log(e);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 회원가입 2(loginId, 나머지 필드)
const patchOwner = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const ownerCreateDTO: OwnerCreateDTO = req.body;
    const loginId = ownerCreateDTO.loginId;
    const password = ownerCreateDTO.password;
    const store = ownerCreateDTO.store;
    const director = ownerCreateDTO.director;
    const phone = ownerCreateDTO.phone;
    const email = ownerCreateDTO.email;
    const address = ownerCreateDTO.address;
    const licenseNumber = ownerCreateDTO.licenseNumber;
    const termsAgree = req.body.termsAgree;
    const marketingAgree = req.body.marketingAgree;
    if (
      !loginId ||
      !password ||
      !store ||
      !director ||
      !phone ||
      !email ||
      !address ||
      !licenseNumber ||
      !termsAgree
    ) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    console.log("patch");
    const data = await authService.patchOwner(ownerCreateDTO);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.OWNER_SIGNUP_2_FAIL));
    }

    // jwtHandler 내 sign 함수를 이용해 accessToken 생성
    const accessToken = jwtHandler.sign(data.id);

    const result = {
      userId: data.id,
      storeName: data.store,
      accessToken,
    };

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.OWNER_SIGNUP_2_SUCCESS, result));
  } catch (e) {
    console.log(e);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 고객 유저 로그인
const customerSignIn = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const userSigninDTO: UserSignInDTO = req.body;

  try {
    const user = await authService.customerSignIn(userSigninDTO);

    if (!user)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
    else if (user === sc.UNAUTHORIZED)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const tokenUser = user as Customer;
    const accessToken = jwtHandler.sign(tokenUser.id);

    // req.session.save(function () {
    //   req.session.loginId = user.loginId;
    //   router.get("/signout/customer", auth);
    // });

    // 이 req.session 세션이 logout 컨트롤러 호출 시 유지되지 않는 것으로 보인다.

    let result = {
      who: "customer",
      id: tokenUser.id,
      loginId: tokenUser.loginId,
      name: tokenUser.name,
      accessToken,
    };

    if (tokenUser.loginId === "admin") {
      result = {
        who: "manager",
        id: tokenUser.id,
        loginId: tokenUser.loginId,
        name: tokenUser.name,
        accessToken,
      };
    }

    res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  } catch (e) {
    console.log(error);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 로그인
const ownerSignIn = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const userSigninDTO: UserSignInDTO = req.body;

  try {
    const user = await authService.ownerSignIn(userSigninDTO);

    if (!user)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
    else if (user === sc.UNAUTHORIZED)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const tokenUser = user as Store_Owner;
    const accessToken = jwtHandler.sign(tokenUser.id);

    const result = {
      who: "owner",
      id: tokenUser.id,
      loginId: tokenUser.loginId,
      storeId: tokenUser.storeId,
      store: tokenUser.store,
      director: tokenUser.director,
      authorized: tokenUser.authorized,
      stampAuthorized: tokenUser.stampAuthorized,
      accessToken,
    };

    res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  } catch (e) {
    console.log(error);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// // 고객 유저 로그아웃
// const customerSignOut = async (req: Request, res: Response) => {
//   const id = req.user.id;
//   console.log(req.session);
//   console.log(req.session.loginId); // undefined 출력

//   if (!req.session.loginId) {
//     res.status(400).send({ data: null, message: "not authorized" });
//   } else {
//     req.session.destroy();
//     const destroy = req.session.loginId;
//     res.json({ data: null, message: "ok", destroy });
//   }
// };

// 고객 유저 회원정보 수정
const customerUpdate = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const customerupdateDTO: CustomerUpdateDTO = req.body;
  const id = req.user.id;
  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;
  try {
    const updatedUserId = await authService.customerUpdate(
      id,
      customerupdateDTO,
      path
    );
    if (!updatedUserId) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.UPDATE_USER_SUCCESS, { id: updatedUserId }));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 회원정보 수정
const ownerUpdate = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const ownerUpdateDTO: OwnerUpdateDTO = req.body;
  const id = req.user.id;
  const image = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log(image);
  const path1 = image.file1[0].path;
  const path2 = image.file2[0].path;
  console.log(path1);
  console.log(path2);

  const password = ownerUpdateDTO.password;
  const director = ownerUpdateDTO.director;
  const phone = ownerUpdateDTO.phone;
  const email = ownerUpdateDTO.email;
  const address = ownerUpdateDTO.address;
  const licenseNumber = ownerUpdateDTO.licenseNumber;

  try {
    if (
      !password ||
      !director ||
      !phone ||
      !email ||
      !address ||
      !licenseNumber
    ) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    const updatedUserId = await authService.ownerUpdate(
      +id,
      ownerUpdateDTO,
      path1,
      path2
    );
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.UPDATE_USER_SUCCESS, { id: updatedUserId }));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 고객 유저 회원정보 찾기 및 비밀번호 재설정
const findCustomerByEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email || email === "") {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const customer = await authService.findCustomerByEmail(email);
    if (customer) {
      // 10글자 string
      const token = crypto.randomBytes(5).toString("hex");
      const data = {
        token,
        customerId: customer.id,
        ttl: 300, // Time To Live 5분
      };
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      const name = customer.name;
      const loginId = customer.loginId;
      const emailOptions = {
        from: process.env.GMAIL_ID,
        to: email,
        subject: "[SOBOK] 회원님의 ID/비밀번호 정보입니다.",
        html:
          `<p>안녕하세요, SOBOK입니다.</p>` +
          `<p>'${name}'님의 아이디 : ${loginId} </p>` +
          `초기화된 임시 비밀번호 : <b>${token}</b> </p>` +
          `<p>(임시 비밀번호는 로그인 후 변경해주세요.)</p>` +
          `<p>감사합니다. </p>`,
      };
      transporter.sendMail(emailOptions);

      // 비밀번호 재설정
      const resetPassword = await authService.resetCustomerPw(
        customer.id,
        token
      );
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.SEND_EMAIL_RESET_PW_SUCCESS, resetPassword));
    } else {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_CUSTOMER_BY_EMAIL_FAIL));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 회원정보 찾기 및 비밀번호 재설정
const findOwnerByEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email || email === "") {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const owner = await authService.findOwnerByEmail(email);
    if (owner) {
      // 10글자 string
      const token = crypto.randomBytes(5).toString("hex");
      const data = {
        token,
        ownerId: owner.id,
        ttl: 300, // Time To Live 5분
      };
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      const name = owner.director;
      const loginId = owner.loginId;
      const emailOptions = {
        from: process.env.GMAIL_ID,
        to: email,
        subject: "[SOBOK] 회원님의 ID/비밀번호 정보입니다.",
        html:
          `<p>안녕하세요, SOBOK입니다.</p>` +
          `<p>'${name}' 담당자님의 아이디 : <b>${loginId}</b> </p>` +
          `초기화된 임시 비밀번호 : <b>${token}</b> </p>` +
          `<p>(임시 비밀번호는 로그인 후 변경해주세요.)</p>` +
          `<p>감사합니다. </p>`,
      };
      transporter.sendMail(emailOptions);

      // 비밀번호 재설정
      const resetPassword = await authService.resetOwnerPw(owner.id, token);
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.SEND_EMAIL_RESET_PW_SUCCESS, resetPassword));
    } else {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_OWNER_BY_EMAIL_FAIL));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 고객 유저 탈퇴
const customerDelete = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const deletedUserId = await authService.customerDelete(id);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.DELETE_USER_SUCCESS, { id: deletedUserId }));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 회원탈퇴
const ownerDelete = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const deletedUserId = await authService.ownerDelete(+id);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.DELETE_USER_SUCCESS, { id: deletedUserId }));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 탈퇴

const authController = {
  createCustomer,
  createOwner,
  patchOwner,
  customerSignIn,
  ownerSignIn,
  // customerSignOut,
  customerUpdate,
  ownerUpdate,
  findCustomerByEmail,
  findOwnerByEmail,
  customerDelete,
  ownerDelete,
};

export default authController;
