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
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../service");
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const response_1 = require("../constants/response");
// 고객 스탬프 사용 신청
const createDeliveryRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validation의 결과를 바탕으로 분기 처리
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const id = req.user.id;
    const createDeliveryRequestDTO = req.body;
    try {
        const request = yield service_1.customerService.createDeliveryRequest(id, createDeliveryRequestDTO);
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.CREATE_DELIVERY_REQUEST_SUCCESS, request));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 스탬프 적립
const createStampNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const generateRandNum = (num) => __awaiter(void 0, void 0, void 0, function* () {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < num; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    });
    const randNum = yield generateRandNum(7);
    try {
        const data = yield service_1.customerService.createStampNumber(id, randNum);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CREATE_RANDNUM_FAIL));
        }
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.CREATE_RANDNUM_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const sortType = {
    ALL: "all",
    HOEGI: "hoegi",
    HALLOWEEN: "halloween",
    SOOKMYUNG: "sookmyung",
    XMAS: "xmas",
};
// 고객 스탬프 적립 내역 전체 조회
const getAllStamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const sort = req.query.sort;
    if (!sort) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.ALL &&
        sort !== sortType.HOEGI &&
        sort !== sortType.SOOKMYUNG &&
        sort !== sortType.HALLOWEEN &&
        sort !== sortType.XMAS) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const allStamp = yield service_1.customerService.getAllStamp(sort, id);
        if (!allStamp) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_STAMP_FAIL));
        }
        if (allStamp.length === 0) {
            return res
                .status(constants_1.sc.OK)
                .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_STAMP_NONE, allStamp));
        }
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.GET_ALL_STAMP_SUCCESS, allStamp));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 스탬프 투어 참여 매장 조회
const getAllTourStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const sort = req.query.sort;
    if (!sort) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.ALL &&
        sort !== sortType.HOEGI &&
        sort !== sortType.SOOKMYUNG &&
        sort !== sortType.HALLOWEEN &&
        sort !== sortType.XMAS) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.customerService.getAllTourStore(sort);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_TOUR_STORE_FAIL));
        }
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.GET_ALL_TOUR_STORE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 유저 이름 조회
const getCustomerName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const customerName = yield service_1.customerService.getCustomerName(id);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_USERNAME_SUCCESS, { name: customerName }));
    }
    catch (error) {
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const customerController = {
    getCustomerName,
    createStampNumber,
    createDeliveryRequest,
    getAllStamp,
    getAllTourStore,
};
exports.default = customerController;
//# sourceMappingURL=customerController.js.map