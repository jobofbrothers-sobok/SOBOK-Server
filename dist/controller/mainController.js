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
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const response_1 = require("../constants/response");
const service_1 = require("../service");
// 카페 검색
const getCafeByKeyword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getCafeByKeyWord Controller");
    // 유저 현위치 x, y 좌표
    const x = req.body.x;
    const y = req.body.y;
    const keyword = req.body.keyword;
    if (!x || !y || !keyword) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    let customerId;
    if (req.user === undefined) {
        console.log("req user is undefined");
        customerId = 77777;
    }
    if (req.user) {
        console.log("req user exists");
        customerId = req.user.id;
        console.log("customerId: ", customerId);
    }
    try {
        const data = yield service_1.mainService.getCafeByKeyword(customerId, x, y, keyword);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.SEARCH_CAFE_BY_KEYWORD_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SEARCH_CAFE_BY_KEYWORD_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 카페 찜하기
const createLikeCafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = req.params.storeId;
    const customerId = req.user.id;
    try {
        if (!storeId) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const data = yield service_1.mainService.createLikeCafe(+storeId, customerId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CREATE_LIKE_CAFE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_LIKE_CAFE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 카페 찜 해제하기
const deleteLikeCafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = req.params.storeId;
    const customerId = req.user.id;
    try {
        if (!storeId) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const data = yield service_1.mainService.deleteLikeCafe(+storeId, customerId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.DELETE_LIKE_CAFE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_LIKE_CAFE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 유저 근처 카페 전체 조회
const getAllCafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body.id: ", req.body.id);
    console.log("req.user: ", req.user);
    // 유저 현위치 x, y 좌표
    const x = req.body.x;
    const y = req.body.y;
    const category = req.body.category;
    if (!x || !y || !category) {
        console.log("null value");
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    let customerId;
    if (req.user === undefined) {
        console.log("req user is undefined");
        customerId = 77777;
    }
    if (req.user) {
        console.log("req user exists");
        customerId = req.user.id;
    }
    try {
        console.log("customerId: ", customerId);
        const data = yield service_1.mainService.getAllCafe(customerId, x, y, category);
        if (!data) {
            console.log("bad request");
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_NEAR_CAFE_FAIL));
        }
        else {
            return res
                .status(constants_1.sc.OK)
                .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_NEAR_CAFE_SUCCESS, data));
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 유저 근처 카페 개별 업체 정보 조회
const getCafeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = req.params.storeId;
    if (!storeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.getCafeById(+storeId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_NEAR_CAFE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_NEAR_CAFE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const queryType = {
    ALL: "all",
    MENU: "menu",
    SALE: "sale",
};
// 유저 근처 카페 개별 업체 소식 조회
const getCafeNoticeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.storeId;
    const query = req.query.query;
    if (!id || !query) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (query !== queryType.ALL &&
        query !== queryType.MENU &&
        query !== queryType.SALE) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.mainService.getCafeNoticeById(+id, query);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_CAFE_NOTICE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_CAFE_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 유저 근처 카페 개별 업체 메뉴 조회
const getCafeMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.storeId;
    if (!id) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.getCafeMenuById(+id);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_CAFE_MENU_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_CAFE_MENU_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 유저 근처 카페 개별 업체 피드 조회
const getCafeReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = req.params.storeId;
    if (!storeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.getCafeReviewById(+storeId);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_CAFE_REVIEW_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 유저 근처 카페 개별 업체 피드 작성
const createCafeReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const writerId = req.user.id;
    const storeId = req.params.storeId;
    const createStoreReviewDTO = req.body;
    if (!storeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    const image = req.file;
    const path = image.path;
    // 현시각보다 9시간 느려서 가산
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    try {
        const data = yield service_1.mainService.createCafeReviewById(writerId, +storeId, createStoreReviewDTO, path, date);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CREATE_CAFE_REVIEW_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_CAFE_REVIEW_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 전체 카페 소식 모아보기
const getAllCafeNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (query !== queryType.ALL &&
        query !== queryType.MENU &&
        query !== queryType.SALE) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.mainService.getAllCafeNotice(query);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_CAFE_NOTICE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_CAFE_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 찜한 카페 소식 모아보기
const getAllLikeCafeNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user.id;
    const query = req.query.query;
    if (!query) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (query !== queryType.ALL &&
        query !== queryType.MENU &&
        query !== queryType.SALE) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.mainService.getAllLikeCafeNotice(query, +customerId);
        if (!data || data.length === 0) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_LIKE_CAFE_NOTICE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_LIKE_CAFE_NOTICE_SUCCESS, data));
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
    COOKIE: "cookie",
    CAKE: "cake",
    BEAN: "bean",
};
// 소복 스토어 상품 조회
const getCafeStoreProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = req.query.sort;
    if (!sort) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.ALL &&
        sort !== sortType.COOKIE &&
        sort !== sortType.CAKE &&
        sort !== sortType.BEAN) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.mainService.getCafeStoreProducts(sort);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_STORE_PRODUCTS_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_STORE_PRODUCTS_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 마이페이지 조회
const getCustomerMyPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user.id;
    // 유저 현위치 x, y 좌표
    const x = req.body.x;
    const y = req.body.y;
    if (!x || !y) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.getCustomerMyPage(customerId, x, y);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_CUSTOMER_MYPAGE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_CUSTOMER_MYPAGE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 카페 소식 삭제
const deleteCafeNoticeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeId = req.params.noticeId;
    if (!noticeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.deleteCafeNoticeById(+noticeId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.DELETE_CAFE_NOTICE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_CAFE_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 카페 메뉴 삭제
const deleteCafeMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menuId = req.params.menuId;
    if (!menuId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.deleteCafeMenuById(+menuId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.DELETE_CAFE_MENU_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_CAFE_MENU_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 카페 피드 삭제
const deleteCafeReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.deleteCafeReviewById(+reviewId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.DELETE_CAFE_REVIEW_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_CAFE_REVIEW_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 소복 스토어 상품 삭제
const deleteCafeProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        if (!productId) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const data = yield service_1.mainService.deleteCafeProductById(+productId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.DELETE_STORE_PRODUCTS_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_STORE_PRODUCTS_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 공지사항 전체 조회
const getAllNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service_1.mainService.getAllNotice();
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_ALL_NOTICE_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_ALL_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 공지사항 개별 조회
const findNoticeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeId = req.params.noticeId;
    if (!noticeId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.mainService.findNoticeById(+noticeId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_NOTICE_FAIL));
        }
        return res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.GET_NOTICE_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const userType = {
    CUSTOMER: "customer",
    OWNER: "owner",
};
// 문의사항 작성
const createInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const user = req.query.user;
    const userId = req.user.id;
    const createInquiryDTO = req.body;
    // 현시각보다 9시간 느려서 가산
    const now = new Date().getTime() + 1 * 60 * 60 * 9 * 1000;
    const date = new Date(now);
    if (!user) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (user !== userType.CUSTOMER && user !== userType.OWNER) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.mainService.createInquiry(user, userId, createInquiryDTO, date);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CREATE_INQUIRY_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CREATE_INQUIRY_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const mainController = {
    getCafeByKeyword,
    createLikeCafe,
    deleteLikeCafe,
    getAllCafe,
    getCafeById,
    getCafeNoticeById,
    getCafeMenuById,
    getCafeReviewById,
    createCafeReviewById,
    getAllCafeNotice,
    getAllLikeCafeNotice,
    getCafeStoreProducts,
    getCustomerMyPage,
    deleteCafeNoticeById,
    deleteCafeMenuById,
    deleteCafeReviewById,
    deleteCafeProductById,
    getAllNotice,
    findNoticeById,
    createInquiry,
};
exports.default = mainController;
//# sourceMappingURL=mainController.js.map