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
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const response_1 = require("../constants/response");
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const service_1 = require("../service");
// 매니저 회원가입
const managerSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const managerCreateDTO = req.body;
    try {
        const data = yield service_1.managerService.managerSignup(managerCreateDTO);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.SIGNUP_FAIL));
        }
        // jwtHandler 내 sign 함수를 이용해 accessToken 생성
        const accessToken = jwtHandler_1.default.sign(data.id);
        const result = {
            userId: data.id,
            loginId: data.loginId,
            accessToken,
        };
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.SIGNUP_SUCCESS, result));
    }
    catch (error) {
        console.log(error);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 매니저 로그인
const managerSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const userSigninDTO = req.body;
    try {
        const userId = yield service_1.managerService.managerSignIn(userSigninDTO);
        if (!userId)
            return res.status(constants_1.sc.NOT_FOUND).send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.NOT_FOUND));
        else if (userId === constants_1.sc.UNAUTHORIZED)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.INVALID_PASSWORD));
        const accessToken = jwtHandler_1.default.sign(userId);
        const result = {
            who: "manager",
            userId: userId,
            accessToken,
        };
        res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SIGNIN_SUCCESS, result));
    }
    catch (e) {
        console.log(e);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 회원가입 승인
const grantOwnerSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const { id } = req.params;
    try {
        const grantOwnerId = yield service_1.managerService.grantOwnerSignUp(+id);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SIGNUP_GRANT_SUCCESS, { grantOwnerId: grantOwnerId }));
    }
    catch (error) {
        console.log(error);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const sortType = {
    ALL: "all",
    AUTH: "auth",
    NOT_AUTH: "pending",
};
// 최고관리자 담당자(점주) 정보 전체 조회
const getAllOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = req.query.sort;
    const ownerName = req.body.ownerName;
    if (!sort) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.ALL &&
        sort !== sortType.AUTH &&
        sort !== sortType.NOT_AUTH) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.managerService.getAllOwner(sort, ownerName);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_OWNER_FAIL, data));
        }
        if (data.length === 0 && data != null) {
            return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.NO_OWNER_YET, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_OWNER_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 담당자(점주) 정보 개별 조회
const getOwnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = req.params.id;
    if (!ownerId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.getOwnerById(+ownerId);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_OWNER_FAIL, data));
        }
        return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_OWNER_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 고객 정보 전체 조회
const getAllCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerName = req.body.customerName;
    try {
        const data = yield service_1.managerService.getAllCustomer(customerName);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_CUSTOMER_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_CUSTOMER_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 고객 정보 개별 조회
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    if (!customerId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.getCustomerById(+customerId);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_CUSTOMER_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_CUSTOMER_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 스탬프 서비스 사용 신청 담당자 전체 조회
const getAllStampSignInRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = req.query.sort;
    const keyword = req.body.keyword;
    if (!sort) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.AUTH && sort !== sortType.NOT_AUTH) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.managerService.getAllStampSignInRequest(sort, keyword);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_STAMP_SIGNIN_REQUEST_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_STAMP_SIGNIN_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 스탬프 서비스 사용 신청 담당자 개별 조회
const getStampSignInRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = req.params.id;
    try {
        const data = yield service_1.managerService.getStampSignInRequest(+ownerId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_STAMP_SIGNIN_REQUEST_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_STAMP_SIGNIN_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 스탬프 서비스 사용 신청 승인
const stampSignInGrant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = req.params.id;
    try {
        const data = yield service_1.managerService.stampSignInGrant(+ownerId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GRANT_STAMP_SIGNIN_REQUEST_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GRANT_STAMP_SIGNIN_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 투어 추가하기
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createTourDTO = req.body;
    try {
        const image = req.file;
        const path = image.path;
        if (!image) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const createTour = yield service_1.managerService.createTour(createTourDTO, path);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_TOUR_SUCCESS, createTour));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 투어 추가 시 매장 검색
const getStoreByStoreName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const store = req.body.storeName;
    try {
        if (!store) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const data = yield service_1.managerService.getStoreByStoreName(store);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_STORE_BY_STORENAME_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_STORE_BY_STORENAME_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 배송신청 리스트 전체 조회
const getAllDeliveryRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.body.keyword;
    try {
        const data = yield service_1.managerService.getAllDeliveryRequest(keyword);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_DELIVERY_REQUEST_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_DELIVERY_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 배송신청 리스트 개별 조회
const getDeliveryRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryId = req.params.id;
    try {
        const data = yield service_1.managerService.getDeliveryRequestById(+deliveryId);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_DELIVERY_REQUEST_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_DELIVERY_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 스탬프 정보 조회 (스템프 정보 리스트 조회)
const getAllTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.body.keyword;
    try {
        const data = yield service_1.managerService.getAllTour(keyword);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_TOUR_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_TOUR_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 소복 매니저 신청 리스트 전체 조회
const getAllAlimRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.body.keyword;
    try {
        const data = yield service_1.managerService.getAllAlimRequest(keyword);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.success)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_ALIM_REQUEST_FAIL, data));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_ALIM_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 소복 매니저 신청 리스트 개별 조회
const getAlimRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.getAlimRequestById(+id);
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALIM_REQUEST_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALIM_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 소복 매니저 문자 일괄전송
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const writerId = req.body.writerId;
    const content = req.body.content;
    if (!writerId || !content) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.sendMessage(writerId, content);
        if (data === null) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.SEND_MESSAGE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SEND_MESSAGE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 소복 매니저 카톡 일괄전송
const sendKakao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const writerId = req.body.writerId;
    const content = req.body.content;
    if (!writerId || !content) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.sendKakao(writerId, content);
        if (data === null) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.SEND_KAKAO_FAIL));
        }
        return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SEND_KAKAO_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 공지사항 작성
const createNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    const createNoticeDTO = req.body;
    const image = req.file;
    const path = image.path;
    if (!image) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.managerService.createNotice(createNoticeDTO, date, path);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 최고관리자 문의사항 전체 조회
const getAllInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service_1.managerService.getAllInquiry();
        if (!data) {
            return res
                .status(constants_1.sc.NOT_FOUND)
                .send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.GET_ALL_INQUIRY_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_INQUIRY_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
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
    getAllInquiry,
};
exports.default = managerController;
//# sourceMappingURL=managerController.js.map