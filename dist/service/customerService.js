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
const ownerService_1 = __importDefault(require("./ownerService"));
const prisma = new client_1.PrismaClient();
// 고객 유저 이름 조회
const getCustomerName = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.customer.findUnique({
        where: {
            id: id,
        },
    });
    return data === null || data === void 0 ? void 0 : data.name;
});
// 고객 유저 조회
const findCustomerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.customer.findUnique({
        where: {
            id: id,
        },
    });
    return data;
});
// 고객 스탬프 적립
const createStampNumber = (id, randNum) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.stamp.create({
        data: {
            randNum: randNum,
            customerId: id,
        },
    });
    return data;
});
// 고객 스탬프 전체 조회
const getAllStamp = (sort, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (sort !== "all") {
        switch (sort) {
            case "hoegi":
                const hoegi = yield prisma.stamp.findMany({
                    where: {
                        customerId: id,
                        tour: { contains: "회기" },
                    },
                });
                return hoegi;
            case "sookmyung":
                const sookmyung = yield prisma.stamp.findMany({
                    where: {
                        customerId: id,
                        tour: { contains: "숙대" },
                    },
                });
                return sookmyung;
            case "halloween":
                const halloween = yield prisma.stamp.findMany({
                    where: {
                        customerId: id,
                        tour: { contains: "할로윈" },
                    },
                });
                console.log(halloween);
                return halloween;
            case "xmas":
                const xmas = yield prisma.stamp.findMany({
                    where: {
                        customerId: id,
                        tour: { contains: "크리스마스" },
                    },
                });
                return xmas;
        }
    }
    if (sort === "all") {
        const data = yield prisma.stamp.findMany({
            where: {
                customerId: id,
            },
        });
        return data;
    }
});
// 고객 스탬프 투어 참여 매장 조회
const getAllTourStore = (sort) => __awaiter(void 0, void 0, void 0, function* () {
    let tourTitle;
    switch (sort) {
        case "hoegi":
            tourTitle = "회기";
            const hoegiTour = yield ownerService_1.default.getTourByTourTitle(tourTitle);
            const hoegi = yield prisma.store.findMany({
                where: {
                    tourId: hoegiTour === null || hoegiTour === void 0 ? void 0 : hoegiTour.id,
                },
            });
            return hoegi;
        case "sookmyung":
            tourTitle = "숙대";
            const sookTour = yield ownerService_1.default.getTourByTourTitle(tourTitle);
            const sookmyung = yield prisma.store.findMany({
                where: {
                    tourId: sookTour === null || sookTour === void 0 ? void 0 : sookTour.id,
                },
            });
            return sookmyung;
        case "halloween":
            tourTitle = "할로윈";
            const halloweenTour = yield ownerService_1.default.getTourByTourTitle(tourTitle);
            const halloween = yield prisma.store.findMany({
                where: {
                    tourId: halloweenTour === null || halloweenTour === void 0 ? void 0 : halloweenTour.id,
                },
            });
            return halloween;
        case "xmas":
            tourTitle = "크리스마스";
            const xmasTour = yield ownerService_1.default.getTourByTourTitle(tourTitle);
            const xmas = yield prisma.store.findMany({
                where: {
                    tourId: xmasTour === null || xmasTour === void 0 ? void 0 : xmasTour.id,
                },
            });
            return xmas;
    }
});
// 고객 스탬프 배송 신청
const createDeliveryRequest = (id, createDeliveryRequestDTO) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.delivery.create({
        data: {
            reward: createDeliveryRequestDTO.reward,
            customer: createDeliveryRequestDTO.customer,
            phone: createDeliveryRequestDTO.phone,
            address: createDeliveryRequestDTO.address,
            detailAddress: createDeliveryRequestDTO.detailAddress,
            message: createDeliveryRequestDTO.message,
            customerId: id,
        },
    });
    return data;
});
const customerService = {
    getCustomerName,
    findCustomerById,
    createStampNumber,
    getAllStamp,
    createDeliveryRequest,
    getAllTourStore,
};
exports.default = customerService;
//# sourceMappingURL=customerService.js.map