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
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
// 점주 유저 이름조회
const getOwnerName = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Owner.findUnique({
        where: {
            id: id,
        },
    });
    return data === null || data === void 0 ? void 0 : data.director;
});
// 점주 유저 조회
const findOwnerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Owner.findUnique({
        where: {
            id: id,
        },
    });
    return data;
});
// 점주 매장정보 등록 및 수정
const createStoreInfo = (createStoreInfoDTO, ownerId, path) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma.store.findUnique({
        where: {
            ownerId: ownerId,
        },
    });
    //* 이미 등록된 매장정보가 있을 경우 - 수정
    if (store !== null) {
        const updatedData = yield prisma.store.update({
            where: {
                ownerId: ownerId,
            },
            data: {
                storeName: createStoreInfoDTO.storeName,
                description: createStoreInfoDTO.description,
                officeHour: createStoreInfoDTO.officeHour,
                dayOff: createStoreInfoDTO.dayOff,
                homepage: createStoreInfoDTO.homepage,
                image: path,
                category: createStoreInfoDTO.category.split(","),
            },
        });
        console.log("updated");
        return updatedData;
    }
    else {
        //* 이미 등록된 매장정보가 없을 경우 - 등록
        // 점주 유저의 매장 주소 조회
        const owner = yield prisma.store_Owner.findUnique({
            where: {
                id: ownerId,
            },
        });
        const storeLocation = owner === null || owner === void 0 ? void 0 : owner.address;
        // 네이버 지도 API를 통해 x, y 좌표 조회
        const geocodeResult = yield axios_1.default.get(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${storeLocation}`, {
            headers: {
                "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_GEOCODING_CLIENT_ID,
                "X-NCP-APIGW-API-KEY": process.env.NAVER_GEOCODING_CLIENT_SECRET,
            },
        });
        console.log(geocodeResult.data);
        const x = geocodeResult.data.addresses[0].x;
        const y = geocodeResult.data.addresses[0].y;
        // request body에 x, y 좌표를 추가하여 매장 레코드 생성
        const data = yield prisma.store.create({
            data: {
                storeName: createStoreInfoDTO.storeName,
                description: createStoreInfoDTO.description,
                officeHour: createStoreInfoDTO.officeHour,
                dayOff: createStoreInfoDTO.dayOff,
                homepage: createStoreInfoDTO.homepage,
                image: path,
                category: createStoreInfoDTO.category.split(","),
                ownerId,
                x: x,
                y: y,
            },
        });
        console.log("created");
        return data;
    }
});
// 점주 매장id 부여
const createStoreIdForOwner = (ownerId, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Owner.update({
        where: {
            id: ownerId,
        },
        data: {
            storeId: storeId,
        },
    });
    return data;
});
// 점주 매장정보 수정
const updateStoreInfo = (storeId, createStoreInfoDTO, path) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store.update({
        where: {
            id: storeId,
        },
        data: {
            storeName: createStoreInfoDTO.storeName,
            description: createStoreInfoDTO.description,
            officeHour: createStoreInfoDTO.officeHour,
            dayOff: createStoreInfoDTO.dayOff,
            homepage: createStoreInfoDTO.homepage,
            image: path,
            category: createStoreInfoDTO.category.split(","),
        },
    });
    return data;
});
// ownerId로 점주 매장 조회
const getStorebyOwnerId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store.findFirst({
        where: {
            ownerId: id,
        },
    });
    console.log("getStorebyOwnerId");
    return data;
});
// storeId로 점주 매장 조회
const getStorebyStoreId = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store.findUnique({
        where: {
            id: storeId,
        },
    });
    console.log("getStorebyStoreId");
    return data;
});
// tourId로 투어 정보 조회
const getTourByTourId = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.tour.findUnique({
        where: {
            id: tourId,
        },
    });
    console.log("getTourByTourId");
    return data;
});
// 투어 제목으로 tourId 조회
const getTourByTourTitle = (tour) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.tour.findFirst({
        where: {
            title: { contains: tour },
        },
    });
    return data;
});
// 점주 소복 스탬프 서비스 사용 신청
const requestStampSignIn = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.stamp_Request.create({
        data: {
            ownerId: userId,
        },
    });
    return data;
});
//** 유저 생성번호로 스탬프 적립 승낙
const grantStampByRandNum = (randNum, date, storeId, storeName, tourTitle, tourId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("----------");
    console.log("request body: ");
    console.log("storeId: ", storeId);
    console.log("storeName: ", storeName);
    console.log("tourTitle: ", tourTitle);
    console.log("tourId: ", tourId);
    // 유저 생성번호만 등록된 상태인 스탬프
    const stamp = yield prisma.stamp.findUnique({
        where: {
            randNum: randNum,
        },
    });
    // 스탬프를 적립한 고객의 id
    const customerId = stamp === null || stamp === void 0 ? void 0 : stamp.customerId;
    // 현재 투어에 적립한 고객의 스탬프 개수 전체
    const totalStampCount = yield prisma.stamp.findMany({
        where: {
            customerId: customerId,
            tourId: tourId,
            tour: tourTitle,
        },
    });
    console.log("----------");
    console.log("totalStampCount: ", totalStampCount.length);
    console.log("----------");
    if (totalStampCount.length >= 9) {
        console.log("totalStampCount.length >= 9");
        return;
    }
    else {
        // 스탬프 적립 승낙
        const data = yield prisma.stamp.update({
            where: {
                randNum: randNum,
            },
            data: {
                timestamp: date,
                storeId: storeId,
                store: storeName,
                tour: tourTitle,
                tourId: tourId,
            },
        });
        // 그 고객의 stampCount 증가시키기
        const addStampCount = yield prisma.customer.update({
            where: {
                id: customerId,
            },
            data: {
                stampCount: {
                    increment: 1,
                },
            },
        });
        console.log("stampCount: ", addStampCount.stampCount);
        console.log("customerId: ", customerId);
        console.log("tourId: ", tourId);
        // 해당 투어에서의 적립한 스탬프 개수가 9의 배수이면 쿠폰 개수 증가
        // 현재 9개를 넘게 적립이 불가
        const tourStamp = yield prisma.stamp.findMany({
            where: {
                customerId: customerId,
                tourId: data.tourId,
            },
        });
        const tourStampCount = tourStamp.length;
        console.log("customer", customerId, "'s tourstampcount: ", tourStampCount);
        if (tourStampCount % 9 === 0 && tourStampCount >= 0) {
            const addTourStampCount = yield prisma.customer.update({
                where: {
                    id: customerId,
                },
                data: {
                    couponCount: {
                        increment: 1,
                    },
                },
            });
            console.log("coupontCount: ", addTourStampCount.couponCount);
            return data;
        }
        else {
            console.log("if문 탈출: ");
        }
    }
});
// 점주 매장 소식 등록
const createStoreNotice = (createStoreNoticeDTO, path, storeId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Notice.create({
        data: {
            category: createStoreNoticeDTO.category,
            title: createStoreNoticeDTO.title,
            content: createStoreNoticeDTO.content,
            image: path,
            storeId: storeId,
            createdTime: date,
        },
    });
    return data;
});
// 점주 매장 메뉴 등록
const createStoreMenu = (createStoreMenuDTO, path, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Menu.create({
        data: {
            title: createStoreMenuDTO.title,
            content: createStoreMenuDTO.content,
            image: path,
            storeId,
        },
    });
    return data;
});
// 점주 스토어 상품 등록
const createStoreProduct = (createStoreProductDTO, path, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Product.create({
        data: {
            category: createStoreProductDTO.category,
            name: createStoreProductDTO.name,
            price: createStoreProductDTO.price,
            discountPrice: createStoreProductDTO.discountPrice,
            url: createStoreProductDTO.url,
            image: path,
            storeId,
        },
    });
    return data;
});
// 점주 소복 매니저 서비스 사용 신청
const createAlimRequest = (ownerCreateAlimRequestDTO, userId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.alim_Request.create({
        data: {
            category: ownerCreateAlimRequestDTO.category,
            content: ownerCreateAlimRequestDTO.content,
            isMessage: ownerCreateAlimRequestDTO.isMessage,
            isKakao: ownerCreateAlimRequestDTO.isKakao,
            writerId: userId,
            timestamp: date,
        },
    });
    return data;
});
const ownerService = {
    getOwnerName,
    findOwnerById,
    createStoreInfo,
    createStoreIdForOwner,
    updateStoreInfo,
    getStorebyOwnerId,
    getStorebyStoreId,
    getTourByTourId,
    getTourByTourTitle,
    requestStampSignIn,
    grantStampByRandNum,
    createStoreNotice,
    createStoreMenu,
    createStoreProduct,
    createAlimRequest,
};
exports.default = ownerService;
//# sourceMappingURL=ownerService.js.map