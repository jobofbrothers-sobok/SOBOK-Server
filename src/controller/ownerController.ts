import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import ownerService from "../service/ownerService";
import { OwnerUpdateDTO } from "../interfaces/user/ownerUpdateDTO";

// 점주 유저 생성
const createOwner = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const ownerCreateDTO: OwnerCreateDTO = req.body;
  const termsAgree = req.body.termsAgree;

  if (!termsAgree) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const data = await ownerService.createOwner(ownerCreateDTO);

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
    const userId = await ownerService.ownerSignIn(userSigninDTO);

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

// 점주 유저 회원정보 수정
const updateOwner = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const ownerUpdateDTO: OwnerUpdateDTO = req.body;
  const { id } = req.params;

  try {
    const updatedUserId = await ownerService.updateOwner(+id, ownerUpdateDTO);
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

// 고객 유저 회원탈퇴
const ownerDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUserId = await ownerService.ownerDelete(+id);

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

// 점주 유저 이름 조회
const getOwnerName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerName = await ownerService.getOwnerName(+id);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USERNAME_SUCCESS, { name: ownerName }));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const ownerController = {
  createOwner,
  ownerSignIn,
  updateOwner,
  ownerDelete,
  getOwnerName,
};

export default ownerController;
