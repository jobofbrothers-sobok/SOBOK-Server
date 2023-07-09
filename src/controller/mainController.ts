import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { mainService } from "../service";
import axios from "axios";

// 유저 근처 카페 전체 조회
const getAllCafe = async (req: Request, res: Response) => {
  // 유저 현위치 x, y 좌표
  const x = req.body.x;
  const y = req.body.y;
  const category = req.body.category;

  try {
    const data = await mainService.getAllCafe(x, y, category);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_NEAR_CAFE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 유저 근처 카페 개별 업체 정보 조회
const getCafeById = async (req: Request, res: Response) => {
  const storeId = req.params.id;
  if (!storeId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await mainService.getCafeById(+storeId);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_NEAR_CAFE_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_NEAR_CAFE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 유저 근처 카페 개별 업체 소식 조회
const getCafeNoticeById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await mainService.getCafeNoticeById(+id);
    if (!data || data.length === 0) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_CAFE_NOTICE_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_CAFE_NOTICE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 유저 근처 카페 개별 업체 메뉴 조회
const getCafeMenuById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await mainService.getCafeMenuById(+id);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_CAFE_MENU_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_CAFE_MENU_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

// 유저 근처 카페 개별 업체 피드 조회
const getCafeReviewById = async (req: Request, res: Response) => {
  const storeId = req.params.id;
  if (!storeId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  try {
    const data = await mainService.getCafeReviewById(+storeId);
    if (!data || data.length === 0) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.GET_CAFE_REVIEW_FAIL));
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_CAFE_REVIEW_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const mainController = {
  getAllCafe,
  getCafeById,
  getCafeNoticeById,
  getCafeMenuById,
  getCafeReviewById,
};
export default mainController;
