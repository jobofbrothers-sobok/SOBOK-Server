import { CreateNoticeDTO } from "./../interfaces/manager/createNoticeDTO";
import { CreateTourDTO } from "./../interfaces/manager/createTourDTO";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { ManagerCreateDTO } from "./../interfaces/user/managerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { managerService } from "../service";
import { CreateTourIdForStoreDTO } from "../interfaces/manager/createTourIdForStoreDTO";

// 매니저 회원가입
const managerSignup = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const managerCreateDTO: ManagerCreateDTO = req.body;

  try {
    const data = await managerService.managerSignup(managerCreateDTO);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
    }

    // jwtHandler 내 sign 함수를 이용해 accessToken 생성
    const accessToken = jwtHandler.sign(data.id);

    const result = {
      userId: data.id,
      loginId: data.loginId,
      accessToken,
    };

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result));
  } catch (error) {
    console.log(error);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 매니저 로그인
const managerSignin = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const userSigninDTO: UserSignInDTO = req.body;

  try {
    const userId = await managerService.managerSignIn(userSigninDTO);

    if (!userId)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
    else if (userId === sc.UNAUTHORIZED)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const accessToken = jwtHandler.sign(userId);

    const result = {
      who: "manager",
      userId: userId,
      accessToken,
    };

    res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  } catch (e) {
    console.log(e);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 회원가입 승인
const grantOwnerSignUp = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const { id } = req.params;

  try {
    const grantOwnerId = await managerService.grantOwnerSignUp(+id);

    return res
      .status(sc.OK)
      .send(
        success(sc.OK, rm.SIGNUP_GRANT_SUCCESS, { grantOwnerId: grantOwnerId })
      );
  } catch (error) {
    console.log(error);
    // 서버 내부에서 오류 발생
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const sortType = {
  ALL: "all",
  AUTH: "auth",
  NOT_AUTH: "pending",
};

// 최고관리자 담당자(점주) 정보 전체 조회
const getAllOwner = async (req: Request, res: Response) => {
  const sort = req.query.sort as string;
  const ownerName = req.body.ownerName;
  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  if (
    sort !== sortType.ALL &&
    sort !== sortType.AUTH &&
    sort !== sortType.NOT_AUTH
  ) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  try {
    const data = await managerService.getAllOwner(sort, ownerName);
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_ALL_OWNER_FAIL, data));
    }

    if (data.length === 0 && data != null) {
      return res.status(sc.OK).send(success(sc.OK, rm.NO_OWNER_YET, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_OWNER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 담당자(점주) 정보 개별 조회
const getOwnerById = async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  if (!ownerId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await managerService.getOwnerById(+ownerId);
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_OWNER_FAIL, data));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.GET_OWNER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 고객 정보 전체 조회
const getAllCustomer = async (req: Request, res: Response) => {
  try {
    const data = await managerService.getAllCustomer();
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_ALL_CUSTOMER_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_CUSTOMER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 고객 정보 개별 조회
const getCustomerById = async (req: Request, res: Response) => {
  const customerId = req.params.id;
  if (!customerId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await managerService.getCustomerById(+customerId);
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_CUSTOMER_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_CUSTOMER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 스탬프 서비스 사용 신청 담당자 전체 조회
const getAllStampSignInRequest = async (req: Request, res: Response) => {
  const sort = req.query.sort as string;
  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  if (sort !== sortType.AUTH && sort !== sortType.NOT_AUTH) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  try {
    const data = await managerService.getAllStampSignInRequest(sort);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_ALL_STAMP_SIGNIN_REQUEST_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_STAMP_SIGNIN_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 스탬프 서비스 사용 신청 담당자 개별 조회
const getStampSignInRequest = async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  try {
    const data = await managerService.getStampSignInRequest(+ownerId);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_STAMP_SIGNIN_REQUEST_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_STAMP_SIGNIN_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 스탬프 서비스 사용 신청 승인
const stampSignInGrant = async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  try {
    const data = await managerService.stampSignInGrant(+ownerId);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GRANT_STAMP_SIGNIN_REQUEST_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GRANT_STAMP_SIGNIN_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 투어 추가하기
const createTour = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const createTourDTO: CreateTourDTO = req.body;
  try {
    const image: Express.Multer.File = req.file as Express.Multer.File;
    const path = image.path;

    if (!image) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    const createTour = await managerService.createTour(createTourDTO, path);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_TOUR_SUCCESS, createTour));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 투어 추가 시 매장 검색
const getStoreByStoreName = async (req: Request, res: Response) => {
  const store = req.body.storeName;
  try {
    if (!store) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    const data = await managerService.getStoreByStoreName(store);
    if (!data || data.length === 0) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_STORE_BY_STORENAME_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_STORE_BY_STORENAME_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 배송신청 리스트 전체 조회
const getAllDeliveryRequest = async (req: Request, res: Response) => {
  try {
    const data = await managerService.getAllDeliveryRequest();
    if (!data || data.length === 0) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_ALL_DELIVERY_REQUEST_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_DELIVERY_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 배송신청 리스트 개별 조회
const getDeliveryRequestById = async (req: Request, res: Response) => {
  const deliveryId = req.params.id;
  try {
    const data = await managerService.getDeliveryRequestById(+deliveryId);
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_DELIVERY_REQUEST_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_DELIVERY_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 스탬프 정보 조회 (스템프 정보 리스트 조회)
const getAllTour = async (req: Request, res: Response) => {
  try {
    const data = await managerService.getAllTour();
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_ALL_TOUR_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_TOUR_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 소복 매니저 신청 리스트 전체 조회
const getAllAlimRequest = async (req: Request, res: Response) => {
  try {
    const data = await managerService.getAllAlimRequest();
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(success(sc.NOT_FOUND, rm.GET_ALL_ALIM_REQUEST_FAIL, data));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_ALIM_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 소복 매니저 신청 리스트 개별 조회
const getAlimRequestById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await managerService.getAlimRequestById(+id);
    if (!data) {
      return res
        .status(sc.NOT_FOUND)
        .send(fail(sc.NOT_FOUND, rm.GET_ALIM_REQUEST_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALIM_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 소복 매니저 문자 일괄전송
const sendMessage = async (req: Request, res: Response) => {
  const writerId = req.body.writerId;
  const content = req.body.content;
  if (!writerId || !content) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await managerService.sendMessage(writerId, content);
    if (data === null) {
      return res
        .status(sc.NOT_FOUND)
        .send(fail(sc.NOT_FOUND, rm.SEND_MESSAGE_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.SEND_MESSAGE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 소복 매니저 카톡 일괄전송
const sendKakao = async (req: Request, res: Response) => {
  const writerId = req.body.writerId;
  const content = req.body.content;
  if (!writerId || !content) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await managerService.sendKakao(writerId, content);
    if (data === null) {
      return res
        .status(sc.NOT_FOUND)
        .send(fail(sc.NOT_FOUND, rm.SEND_KAKAO_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.SEND_KAKAO_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 최고관리자 공지사항 작성
const createNotice = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
  const date = new Date(now);
  const createNoticeDTO: CreateNoticeDTO = req.body;

  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  if (!image) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const data = await managerService.createNotice(createNoticeDTO, date, path);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_NOTICE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
const managerController = {
  managerSignup,
  managerSignin,
  grantOwnerSignUp,
  getAllStampSignInRequest,
  getStampSignInRequest,
  stampSignInGrant,
  createTour,
  getStoreByStoreName,
  getAllDeliveryRequest,
  getDeliveryRequestById,
  getAllTour,
  getAllOwner,
  getOwnerById,
  getAllCustomer,
  getCustomerById,
  getAllAlimRequest,
  getAlimRequestById,
  sendMessage,
  sendKakao,
  createNotice,
};

export default managerController;
