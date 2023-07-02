import { OwnerCreateAlimRequestDTO } from "./../interfaces/user/ownerCreateAlimRequestDTO";
import { CreateStoreProductDTO } from "./../interfaces/store/creatseStoreProductDTO";
import { CreateStoreMenuDTO } from "./../interfaces/store/createStoreMenuDTO";
import { CreateStoreInfoDTO } from "./../interfaces/store/createStoreInfoDTO";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import ownerService from "../service/ownerService";
import { OwnerUpdateDTO } from "../interfaces/user/ownerUpdateDTO";
import { CreateStoreNoticeDTO } from "../interfaces/store/createStoreNoticeDTO";
import { customerService } from "../service";

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

// 점주 유저 매장 정보 등록
const createStoreInfo = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const createStoreInfoDTO: CreateStoreInfoDTO = req.body;
  const ownerId = req.user.id;
  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;
  try {
    const createStore = await ownerService.createStoreInfo(
      createStoreInfoDTO,
      ownerId,
      path
    );
    console.log(createStore);
    console.log(typeof createStore.category);
    console.log(createStore.category);
    const storeId = createStore.id;
    const createStoreIdForOwner = await ownerService.createStoreIdForOwner(
      ownerId,
      storeId
    );
    return res.status(sc.OK).send(
      success(sc.OK, rm.CREATE_STORE_INFO_SUCCESS, {
        storeName: createStore.storeName,
      })
    );
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 유저 매장 정보 수정
const updateStoreInfo = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const createStoreInfoDTO: CreateStoreInfoDTO = req.body;
  // const userId = req.user.id;
  const storeId = req.params.id;
  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  try {
    const updatedStore = await ownerService.updateStoreInfo(
      +storeId,
      createStoreInfoDTO,
      path
    );
    console.log(updatedStore);
    console.log(typeof updatedStore.category);
    console.log(updatedStore.category);
    return res.status(sc.OK).send(
      success(sc.OK, rm.UPDATE_STORE_INFO_SUCCESS, {
        storeName: updatedStore.storeName,
      })
    );
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 매장소식 등록
const createStoreNotice = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const createStoreNoticeDTO: CreateStoreNoticeDTO = req.body;

  const storeId = req.params.id;

  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  // 현시각보다 9시간 느려서 가산
  const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
  const date = new Date(now);

  try {
    const createStoreNotice = await ownerService.createStoreNotice(
      createStoreNoticeDTO,
      path,
      +storeId,
      date
    );
    console.log(date);
    console.log(typeof date);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_STORE_NOTICE_SUCCESS, createStoreNotice));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 매장메뉴 등록
const createStoreMenu = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const createStoreMenuDTO: CreateStoreMenuDTO = req.body;

  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  const storeId = req.params.id;
  try {
    const createdMenu = await ownerService.createStoreMenu(
      createStoreMenuDTO,
      path,
      +storeId
    );
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_STORE_MENU_SUCCESS, createdMenu));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 매장 스토어 상품 등록
const createStoreProduct = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  const createStoreProductDTO: CreateStoreProductDTO = req.body;

  const image: Express.Multer.File = req.file as Express.Multer.File;
  const path = image.path;

  const storeId = req.params.id;

  if (!storeId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const createdProduct = await ownerService.createStoreProduct(
      createStoreProductDTO,
      path,
      +storeId
    );
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_STORE_PRODUCT_SUCCESS, createdProduct));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 소복 매니저 서비스 사용 신청
const createAlimRequest = async (req: Request, res: Response) => {
  const ownerCreateAlimRequestDTO: OwnerCreateAlimRequestDTO = req.body;
  const userId = req.user.id;
  const error = validationResult(req);
  if (!error.isEmpty() || !userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const data = await ownerService.createAlimRequest(
      ownerCreateAlimRequestDTO,
      userId
    );
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_ALIM_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 소복 스탬프 서비스 사용 신청
const requestStampSignIn = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const data = await ownerService.requestStampSignIn(userId);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.CREATE_STAMP_SIGNIN_REQUEST_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_STAMP_SIGNIN_REQUEST_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 점주 고객 스탬프 적립 승낙
const grantStampByRandNum = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const randNum = req.body.randNum;

  const store = await ownerService.getStorebyOwnerId(userId);
  console.log(store);

  const storeId = store?.id;

  const storeName = store?.storeName;
  console.log(storeName);

  const tourId = store?.tourId;
  console.log(tourId);

  const tour = await ownerService.getTourByTourId(tourId as number);
  const tourTitle = tour?.title;

  // 현시각보다 9시간 느려서 가산
  const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
  const date = new Date(now);

  try {
    const data = await ownerService.grantStampByRandNum(
      randNum,
      date,
      storeId as number,
      storeName as string,
      tourTitle as string,
      tourId as number
    );

    const result = {
      stampId: data.id,
      randNum: data.randNum,
      timestamp: data.timestamp,
      customerId: data.customerId,
      storeId: data.storeId,
    };

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GRANT_STAMP_SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const ownerController = {
  getOwnerName,
  createStoreInfo,
  updateStoreInfo,
  createStoreNotice,
  createStoreMenu,
  createStoreProduct,
  createAlimRequest,
  requestStampSignIn,
  grantStampByRandNum,
};

export default ownerController;
