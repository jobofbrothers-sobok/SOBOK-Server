import { Request, Response } from "express";
import { customerService } from "../service";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { CustomerUpdateDTO } from "../interfaces/user/customerUpdateDTO";
import { CreateDeliveryRequestDTO } from "../interfaces/delivery/createDeliveryRequestDTO";

// 고객 스탬프 사용 신청
const createDeliveryRequest = async (req: Request, res: Response) => {
  // validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const id = req.user.id;
  const createDeliveryRequestDTO: CreateDeliveryRequestDTO = req.body;

  try {
    const request = await customerService.createDeliveryRequest(
      id,
      createDeliveryRequestDTO
    );
    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_DELIVERY_REQUEST_SUCCESS, request));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
// 고객 스탬프 적립
const createStampNumber = async (req: Request, res: Response) => {
  const id = req.user.id;
  const generateRandNum = async (num: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const randNum = await generateRandNum(7);

  try {
    const data = await customerService.createStampNumber(id, randNum);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.CREATE_RANDNUM_FAIL));
    }
    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_RANDNUM_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const sortType = {
  ALL: "all",
  HOEGI: "hoegi",
  HALLOWEEN: "halloween",
  SOOKMYUNG: "sookmyung",
  XMAS: "xmas",
};

// 고객 스탬프 적립 내역 전체 조회
const getAllStamp = async (req: Request, res: Response) => {
  const id = req.user.id;
  const sort = req.query.sort as string;

  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (
    sort !== sortType.ALL &&
    sort !== sortType.HOEGI &&
    sort !== sortType.SOOKMYUNG &&
    sort !== sortType.HALLOWEEN &&
    sort !== sortType.XMAS
  ) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const allStamp = await customerService.getAllStamp(sort, id);
    if (!allStamp) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_ALL_STAMP_FAIL));
    }

    if (allStamp.length === 0) {
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.GET_ALL_STAMP_NONE, allStamp));
    }
    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.GET_ALL_STAMP_SUCCESS, allStamp));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 고객 스탬프 투어 참여 매장 조회
const getAllTourStore = async (req: Request, res: Response) => {
  const id = req.user.id;
  const sort = req.query.sort as string;
  if (!sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (
    sort !== sortType.ALL &&
    sort !== sortType.HOEGI &&
    sort !== sortType.SOOKMYUNG &&
    sort !== sortType.HALLOWEEN &&
    sort !== sortType.XMAS
  ) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const data = await customerService.getAllTourStore(sort);
    if (!data || data.length === 0) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_ALL_TOUR_STORE_FAIL));
    }
    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.GET_ALL_TOUR_STORE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 고객 유저 이름 조회
const getCustomerName = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const customerName = await customerService.getCustomerName(id);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USERNAME_SUCCESS, { name: customerName }));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const customerController = {
  getCustomerName,
  createStampNumber,
  createDeliveryRequest,
  getAllStamp,
  getAllTourStore,
};

export default customerController;
