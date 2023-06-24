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

const sortType = {
  CUSTOMER: "customer",
  OWNER: "owner",
};

// 유저 회원가입
const userSignUp = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const sort = req.query.sort as string;

  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.CUSTOMER && sort !== sortType.OWNER) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  if (sort === sortType.CUSTOMER) {
    const customerCreateDTO: CustomerCreateDTO = req.body;
    const termsAgree = req.body.termsAgree;

    if (!termsAgree) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
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
  }

  if (sort === sortType.OWNER) {
    const ownerCreateDTO: OwnerCreateDTO = req.body;
    const termsAgree = req.body.termsAgree;

    if (!termsAgree) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
      const data = await authService.createOwner(ownerCreateDTO);

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
  }
};

// 유저 로그인
const userSignIn = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const sort = req.query.sort as string;

  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.CUSTOMER && sort !== sortType.OWNER) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  if (sort === sortType.CUSTOMER) {
    const userSigninDTO: UserSignInDTO = req.body;

    try {
      const userId = await authService.customerSignIn(userSigninDTO);

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
  }

  if (sort === sortType.OWNER) {
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

const authController = {
  userSignUp,
  userSignIn,
  customerUpdate,
  ownerUpdate,
};

export default authController;
