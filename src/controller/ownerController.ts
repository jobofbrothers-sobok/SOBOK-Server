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
    // console.log(typeof createStore.description, createStore.description);
    // console.log(typeof createStore.category, createStore.category);
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
    // console.log(typeof updatedStore.description, updatedStore.description);
    // console.log(typeof updatedStore.category, updatedStore.category);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.UPDATE_STORE_INFO_SUCCESS, updatedStore));
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
  const userId = req.user.id;
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
  const createStoreMenuDTO: CreateStoreMenuDTO = req.body;
  const userId = req.user.id;
  const storeId = await ownerService.getStorebyOwnerId(userId);
  console.log(storeId);
  try {
    const createdMenu = await ownerService.createStoreMenu(
      createStoreMenuDTO,
      storeId as number
    );
    console.log(storeId);
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

const createStoreProduct = async (req: Request, res: Response) => {
  const createStoreProductDTO: CreateStoreProductDTO = req.body;
  const userId = req.user.id;
  const storeId = await ownerService.getStorebyOwnerId(userId);
  try {
    const createdProduct = await ownerService.createStoreProduct(
      createStoreProductDTO,
      storeId as number
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

// 점주 고객 스탬프 적립 승낙
const grantStampByRandNum = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const storeId = await ownerService.getStorebyOwnerId(userId);
  const randNum = req.body.randNum;
  // 현시각보다 9시간 느려서 가산
  const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
  const date = new Date(now);
  const store = await ownerService.getStorebyStoreId(storeId as number);
  const storeName = store?.storeName;
  const tourId = store?.tourId;
  const tour = await ownerService.getTourByTourId(tourId as number);
  const tourTitle = tour?.title;
  try {
    const data = await ownerService.grantStampByRandNum(
      randNum,
      date,
      storeId as number,
      storeName,
      tourTitle,
      tourId
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
  }
};

const ownerController = {
  updateOwner,
  getOwnerName,
  createStoreInfo,
  updateStoreInfo,
  createStoreNotice,
  createStoreMenu,
  createStoreProduct,
  grantStampByRandNum,
};

export default ownerController;
