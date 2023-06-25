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

// 점주 유저 회원가입
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
    const termsAgree = req.body.termsAgree;
    // if (!termsAgree) {
    //   console.log("no terms");
    //   return res
    //     .status(sc.BAD_REQUEST)
    //     .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    // }
    console.log("create");
    const data = await authService.createOwner(ownerCreateDTO, path);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
    }

    // jwtHandler 내 sign 함수를 이용해 accessToken 생성
    const accessToken = jwtHandler.sign(data.id);

    const result = {
      userId: data.id,
      name: data.store,
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

    const accessToken = jwtHandler.sign(user.id);
    req.session.loginId = user.loginId;
    console.log(req.session.loginId);
    const result = {
      userId: user.id,
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
    const userId = await authService.ownerSignIn(userSigninDTO);

    if (!userId)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
    else if (userId === sc.UNAUTHORIZED)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const accessToken = jwtHandler.sign(userId);

    const result = {
      userId: userId,
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

// 고객 유저 로그아웃
const customerSignOut = async (req: Request, res: Response) => {
  const id = req.user.id;
  console.log(req.session);
  console.log(req.session.loginId);

  if (!req.session.loginId) {
    res.status(400).send({ data: null, message: "not authorized" });
  } else {
    req.session.destroy();
    const destroy = req.session.loginId;
    res.json({ data: null, message: "ok", destroy });
  }
};

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
  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  try {
    const updatedUserId = await authService.ownerUpdate(
      +id,
      ownerUpdateDTO,
      path
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
  customerSignIn,
  ownerSignIn,
  customerSignOut,
  customerUpdate,
  ownerUpdate,
  customerDelete,
  ownerDelete,
};

export default authController;
