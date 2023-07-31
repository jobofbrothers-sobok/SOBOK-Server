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
const ownerService_1 = __importDefault(require("../service/ownerService"));
// 점주 유저 이름 조회
const getOwnerName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ownerName = yield ownerService_1.default.getOwnerName(+id);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_USERNAME_SUCCESS, { name: ownerName }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 매장 정보 등록 및 수정
const createStoreInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createStoreInfoDTO = req.body;
    const ownerId = req.user.id;
    const image = req.file;
    const path = image.path;
    try {
        const createStore = yield ownerService_1.default.createStoreInfo(createStoreInfoDTO, ownerId, path);
        console.log("createStore: ", createStore);
        console.log(typeof createStore.category);
        console.log(createStore.category);
        const storeId = createStore.id;
        console.log(storeId);
        const createStoreIdForOwner = yield ownerService_1.default.createStoreIdForOwner(ownerId, storeId);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_STORE_INFO_SUCCESS, createStore));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 매장 정보 수정
const updateStoreInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createStoreInfoDTO = req.body;
    // const userId = req.user.id;
    const storeId = req.params.id;
    const image = req.file;
    const path = image.path;
    try {
        const updatedStore = yield ownerService_1.default.updateStoreInfo(+storeId, createStoreInfoDTO, path);
        console.log(updatedStore);
        console.log(typeof updatedStore.category);
        console.log(updatedStore.category);
        return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.UPDATE_STORE_INFO_SUCCESS, {
            storeId: updatedStore.id,
            storeName: updatedStore.storeName,
            ownerId: updatedStore.ownerId,
        }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 매장소식 등록
const createStoreNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createStoreNoticeDTO = req.body;
    const storeId = req.params.id;
    const image = req.file;
    const path = image.path;
    // 현시각보다 9시간 느려서 가산
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    try {
        const createStoreNotice = yield ownerService_1.default.createStoreNotice(createStoreNoticeDTO, path, +storeId, date);
        console.log(date);
        console.log(typeof date);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_STORE_NOTICE_SUCCESS, createStoreNotice));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 매장메뉴 등록
const createStoreMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createStoreMenuDTO = req.body;
    const image = req.file;
    const path = image.path;
    const storeId = req.params.id;
    try {
        const createdMenu = yield ownerService_1.default.createStoreMenu(createStoreMenuDTO, path, +storeId);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_STORE_MENU_SUCCESS, createdMenu));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 매장 스토어 상품 등록
const createStoreProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const createStoreProductDTO = req.body;
    const image = req.file;
    const path = image.path;
    const storeId = req.params.id;
    if (!storeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const createdProduct = yield ownerService_1.default.createStoreProduct(createStoreProductDTO, path, +storeId);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_STORE_PRODUCT_SUCCESS, createdProduct));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 소복 매니저 서비스 사용 신청
const createAlimRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerCreateAlimRequestDTO = req.body;
    const userId = req.user.id;
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty() || !userId) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield ownerService_1.default.createAlimRequest(ownerCreateAlimRequestDTO, userId, date);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_ALIM_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 소복 스탬프 서비스 사용 신청
const requestStampSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const data = yield ownerService_1.default.requestStampSignIn(userId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CREATE_STAMP_SIGNIN_REQUEST_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_STAMP_SIGNIN_REQUEST_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 고객 스탬프 적립 승낙
const grantStampByRandNum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const randNum = req.body.randNum;
    const store = yield ownerService_1.default.getStorebyOwnerId(userId);
    const storeId = store === null || store === void 0 ? void 0 : store.id;
    const storeName = store === null || store === void 0 ? void 0 : store.storeName;
    const tourId = store === null || store === void 0 ? void 0 : store.tourId;
    const tour = yield ownerService_1.default.getTourByTourId(tourId);
    const tourTitle = tour === null || tour === void 0 ? void 0 : tour.title;
    // 현시각보다 9시간 느려서 가산
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    try {
        const data = yield ownerService_1.default.grantStampByRandNum(randNum, date, storeId, storeName, tourTitle, tourId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GRANT_STAMP_FAIL));
        }
        return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GRANT_STAMP_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
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
exports.default = ownerController;
//# sourceMappingURL=ownerController.js.map