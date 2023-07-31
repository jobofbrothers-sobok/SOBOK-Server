"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const response_1 = require("../constants/response");
const tokenType_1 = __importDefault(require("../constants/tokenType"));
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const service_1 = require("../service");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("originalUrl: ", req.originalUrl);
    console.log("authorization: ", req.headers.authorization);
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ").reverse()[0]; //? Bearer ~~ 에서 토큰만 파싱
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
            .status(constants_1.sc.UNAUTHORIZED)
            .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.EMPTY_TOKEN));
    }
    try {
        const decoded = jwtHandler_1.default.verify(token); //? jwtHandler에서 만들어둔 verify로 토큰 검사
        //? 토큰 에러 분기 처리
        if (decoded === tokenType_1.default.TOKEN_EXPIRED)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.EXPIRED_TOKEN));
        console.log("here1");
        if (decoded === tokenType_1.default.TOKEN_INVALID)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.INVALID_TOKEN));
        console.log("here2");
        //? decode한 후 담겨있는 userId를 꺼내옴
        const id = decoded.id;
        if (!id)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.INVALID_TOKEN));
        console.log("here3");
        //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
        req.body.id = id;
        let foundUser;
        if (req.originalUrl.includes("/main")) {
            console.log("originalUrl includes main");
            foundUser = yield service_1.customerService.findCustomerById(id);
            console.log("foundUser: ", foundUser);
        }
        if (req.originalUrl.includes("/customer")) {
            foundUser = yield service_1.customerService.findCustomerById(id);
        }
        if (req.originalUrl.includes("/owner")) {
            foundUser = yield service_1.ownerService.findOwnerById(id);
        }
        if (req.originalUrl.includes("/manager")) {
            foundUser = yield service_1.customerService.findCustomerById(id);
        }
        if (req.originalUrl === "/api/main/inquiry?user=customer") {
            console.log("inquiry by customer");
            foundUser = yield service_1.customerService.findCustomerById(id);
            console.log("foundUser: ", foundUser);
        }
        if (req.originalUrl === "/api/main/inquiry?user=owner") {
            console.log("inquiry by owner");
            foundUser = yield service_1.ownerService.findOwnerById(id);
            console.log("foundUser: ", foundUser);
        }
        // const foundUser = await ownerService.findOwnerById(id);
        if (!foundUser) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NOT_EXISITING_USER));
        }
        req.user = foundUser;
        next();
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
//# sourceMappingURL=auth.js.map