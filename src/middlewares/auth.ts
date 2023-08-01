import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { rm, sc } from "../constants";
import { fail } from "../constants/response";
import tokenType from "../constants/tokenType";
import jwtHandler from "../modules/jwtHandler";
import { customerService, managerService, ownerService } from "../service";

export default async (req: Request, res: Response, next: NextFunction) => {
  console.log("originalUrl: ", req.originalUrl);
  console.log("authorization: ", req.headers.authorization);
  const token = req.headers.authorization?.split(" ").reverse()[0]; //? Bearer ~~ 에서 토큰만 파싱
  // Bearer 얄랴야얄
  console.log(req.route.path);
  console.log(req.headers.authorization);
  console.log(token);

  // 내 근처 카페 전체 조회 - accesstoken이 undefined인 경우도 허용
  if (token === undefined && req.route.path === "/store") {
    console.log("here for /store");
    req.user = undefined;
    next();
    return;
  }

  // 햄버거 버튼에서 키워드로 카페 검색 - accesstoken이 undefined인 경우도 허용
  if (token === undefined && req.route.path === "/") {
    console.log("here for /");
    req.user = undefined;
    next();
    return;
  }

  if (!token) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(fail(sc.UNAUTHORIZED, rm.EMPTY_TOKEN));
  }

  try {
    const decoded = jwtHandler.verify(token); //? jwtHandler에서 만들어둔 verify로 토큰 검사

    //? 토큰 에러 분기 처리
    if (decoded === tokenType.TOKEN_EXPIRED)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
    console.log("here1");
    if (decoded === tokenType.TOKEN_INVALID)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
    console.log("here2");

    //? decode한 후 담겨있는 userId를 꺼내옴
    const id: number = (decoded as JwtPayload).id;
    if (!id)
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
    console.log("here3");

    //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
    req.body.id = id;
    let foundUser;
    if (req.originalUrl.includes("/main")) {
      console.log("originalUrl includes main");
      foundUser = await customerService.findCustomerById(id);
      console.log("foundUser: ", foundUser);
    }

    if (req.originalUrl.includes("/customer")) {
      foundUser = await customerService.findCustomerById(id);
    }

    if (req.originalUrl.includes("/owner")) {
      foundUser = await ownerService.findOwnerById(id);
    }

    if (req.originalUrl.includes("/manager")) {
      foundUser = await customerService.findCustomerById(id);
    }

    if (req.originalUrl === "/api/main/inquiry?user=customer") {
      console.log("inquiry by customer");
      foundUser = await customerService.findCustomerById(id);
      console.log("foundUser: ", foundUser);
    }

    if (
      req.originalUrl === "/api/main/inquiry?user=owner" ||
      req.originalUrl === "/api/main/store/owner"
    ) {
      console.log("inquiry by owner");
      foundUser = await ownerService.findOwnerById(id);
      console.log("foundUser: ", foundUser);
    }

    if (!foundUser) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NOT_EXISITING_USER));
    }

    req.user = foundUser;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
