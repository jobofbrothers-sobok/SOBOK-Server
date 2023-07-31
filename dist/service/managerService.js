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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../constants");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const prisma = new client_1.PrismaClient();
// 매니저 생성
const managerSignup = (managerCreateDTO) => __awaiter(void 0, void 0, void 0, function* () {
    // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
    const salt = yield bcryptjs_1.default.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
    const password = yield bcryptjs_1.default.hash(managerCreateDTO.password, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
    const data = yield prisma.manager.create({
        data: {
            loginId: managerCreateDTO.loginId,
            password,
        },
    });
    return data;
});
// 매니저 로그인
const managerSignIn = (userSignInDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.manager.findFirst({
            where: {
                loginId: userSignInDTO.loginId,
            },
        });
        if (!user)
            return null;
        // bcrypt가 DB에 저장된 기존 password와 넘겨 받은 password를 대조하고
        // match false시 401을 리턴
        const isMatch = yield bcryptjs_1.default.compare(userSignInDTO.password, user.password);
        if (!isMatch)
            return constants_1.sc.UNAUTHORIZED;
        return user.id;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
// 점주 회원가입 승인
const grantOwnerSignUp = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Owner.update({
        where: {
            id: id,
        },
        data: {
            authorized: true,
        },
    });
    return data.id;
});
// 최고관리자 조회
const findManagerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.manager.findUnique({
        where: {
            id,
        },
    });
    return data;
});
// 최고관리자 담당자(점주) 정보 전체 조회
const getAllOwner = (sort, ownerName) => __awaiter(void 0, void 0, void 0, function* () {
    if (sort === "all") {
        const data = yield prisma.store_Owner.findMany();
        if (ownerName) {
            const data = yield prisma.store_Owner.findMany({
                where: {
                    director: { contains: ownerName },
                },
            });
            return data;
        }
        return data;
    }
    if (sort != "all") {
        switch (sort) {
            case "auth":
                const authorizedOwner = yield prisma.store_Owner.findMany({
                    where: {
                        authorized: true,
                    },
                });
                if (ownerName) {
                    const data = yield prisma.store_Owner.findMany({
                        where: {
                            director: { contains: ownerName },
                            authorized: true,
                        },
                    });
                    return data;
                }
                return authorizedOwner;
            case "pending":
                const pendingOwner = yield prisma.store_Owner.findMany({
                    where: {
                        authorized: false,
                    },
                });
                if (ownerName) {
                    const data = yield prisma.store_Owner.findMany({
                        where: {
                            director: { contains: ownerName },
                            authorized: false,
                        },
                    });
                    return data;
                }
                return pendingOwner;
        }
    }
});
// 최고관리자 담당자(점주) 정보 개별 조회
const getOwnerById = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store_Owner.findUnique({
        where: {
            id: ownerId,
        },
    });
    return data;
});
// 최고관리자 고객 정보 전체 조회
const getAllCustomer = (customerName) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.customer.findMany();
    if (customerName) {
        const data = yield prisma.customer.findMany({
            where: {
                name: { contains: customerName },
            },
        });
        return data;
    }
    return data;
});
// 최고관리자 고객 정보 개별 조회
const getCustomerById = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });
    return data;
});
// 최고관리자 투어 추가
const createTour = (createTourDTO, path) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.tour.create({
        data: {
            keyword: createTourDTO.keyword,
            title: createTourDTO.title,
            reward: createTourDTO.reward,
            image: path,
            cafeList: createTourDTO.cafeList.split(","),
        },
    });
    // 매장 정보에 투어 id 부여
    const cafeListArray = createTourDTO.cafeList.split(",");
    for (let i = 0; i < cafeListArray.length; i++) {
        const tourStore = yield prisma.store.updateMany({
            where: {
                storeName: { contains: cafeListArray[i].trim() },
            },
            data: {
                tourId: data.id,
            },
        });
    }
    return data;
});
// 최고관리자 투어 추가 시 매장정보 검색
const getStoreByStoreName = (store) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.store.findMany({
        // 검색어를 포함하는 매장명 조회 시 해당 매장 레코드 반환
        where: {
            storeName: { contains: store },
        },
    });
    return data;
});
// 최고관리자 배송신청 리스트 전체 조회
const getAllDeliveryRequest = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.delivery.findMany({
        where: {
            isGrant: false,
        },
    });
    const keywordData = [];
    for (let i = 0; i < data.length; i++) {
        const customer = yield prisma.customer.findFirst({
            where: {
                id: data[i].customerId,
            },
        });
        data[i].title = `${customer === null || customer === void 0 ? void 0 : customer.name} 배송신청`;
        if (keyword && keyword.trim() !== "") {
            if (data[i].title.includes(keyword)) {
                keywordData.push(data[i]);
                console.log(keywordData);
            }
        }
    }
    if (keywordData.length >= 1) {
        return keywordData;
    }
    if (keywordData.length === 0) {
        return data;
    }
    return data;
});
// 최고관리자 배송신청 리스트 개별 조회
const getDeliveryRequestById = (deliveryId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.delivery.findUnique({
        where: {
            id: deliveryId,
        },
    });
    return data;
});
// 최고관리자 스탬프 서비스 사용 신청 담당자 전체 조회
const getAllStampSignInRequest = (sort, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!keyword) {
        // 키워드를 기입하는 경우
        switch (sort) {
            case "auth":
                const allAuthOwner = yield prisma.store_Owner.findMany({
                    where: {
                        stampAuthorized: true,
                    },
                });
                return allAuthOwner;
            case "pending":
                const allRequest = yield prisma.stamp_Request.findMany();
                console.log("allRequest: ", allRequest);
                let allPendingOwner = [];
                for (let i = 0; i < allRequest.length; i++) {
                    const ownerId = allRequest[i].ownerId;
                    const requestOwner = yield prisma.store_Owner.findFirst({
                        where: {
                            id: ownerId,
                            stampAuthorized: false,
                        },
                    });
                    if (requestOwner !== null) {
                        allPendingOwner.push(requestOwner);
                    }
                }
                return allPendingOwner;
        }
    }
    else {
        // const owner = await prisma.store_Owner.findMany({
        //   where: {
        //     director: { contains: keyword },
        //   },
        // });
        // return owner;
        switch (sort) {
            case "auth":
                const allAuthOwner = yield prisma.store_Owner.findMany({
                    where: {
                        stampAuthorized: true,
                        director: { contains: keyword },
                    },
                });
                return allAuthOwner;
            case "pending":
                const allRequest = yield prisma.stamp_Request.findMany();
                console.log("allRequest: ", allRequest);
                let allPendingOwner = [];
                for (let i = 0; i < allRequest.length; i++) {
                    const ownerId = allRequest[i].ownerId;
                    const requestOwner = yield prisma.store_Owner.findFirst({
                        where: {
                            id: ownerId,
                            stampAuthorized: false,
                            director: { contains: keyword },
                        },
                    });
                    if (requestOwner !== null) {
                        allPendingOwner.push(requestOwner);
                    }
                }
                return allPendingOwner;
        }
    }
});
// 최고관리자 스탬프 서비스 사용 신청 담당자 개별 조회
const getStampSignInRequest = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOwner = yield prisma.stamp_Request.findUnique({
        where: {
            ownerId: ownerId,
        },
    });
    if (requestOwner !== null) {
        const data = yield prisma.store_Owner.findUnique({
            where: {
                id: ownerId,
            },
        });
        return data;
    }
});
// 최고관리자 스탬프 서비스 사용 신청 승인
const stampSignInGrant = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    // 스탬프 사용 신청 건 - 승인 여부 갱신
    yield prisma.stamp_Request.update({
        where: {
            ownerId: ownerId,
        },
        data: {
            isGrant: true,
        },
    });
    // 스탬프 사용 신청 담당자 - 승인 여부 갱신
    const data = yield prisma.store_Owner.update({
        where: {
            id: ownerId,
        },
        data: {
            stampAuthorized: true,
        },
    });
    const result = {
        ownerId: data.id,
        stampAuthorized: data.stampAuthorized,
    };
    return result;
});
// 최고관리자 스탬프 정보 조회 (스템프 정보 리스트 조회)
const getAllTour = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.tour.findMany();
    if (keyword !== null) {
        const data = yield prisma.tour.findMany({
            where: {
                title: { contains: keyword },
            },
        });
        return data;
    }
    return data;
});
// 최고관리자 소복 매니저 신청 리스트 전체 조회
const getAllAlimRequest = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.alim_Request.findMany();
    const keywordData = [];
    for (let i = 0; i < data.length; i++) {
        const store = yield prisma.store.findUnique({
            where: {
                ownerId: data[i].writerId,
            },
        });
        data[i].title = `${store === null || store === void 0 ? void 0 : store.storeName} 문자서비스 신청`;
        if (keyword !== null) {
            if (data[i].title.includes(keyword)) {
                keywordData.push(data[i]);
                console.log(keywordData);
            }
        }
    }
    if (keywordData.length >= 1) {
        return keywordData;
    }
    if (keywordData.length === 0) {
        return data;
    }
});
// 최고관리자 소복 매니저 신청 리스트 개별 조회
const getAlimRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.alim_Request.findUnique({
        where: {
            id: id,
        },
    });
    const store = yield prisma.store.findUnique({
        where: {
            ownerId: data === null || data === void 0 ? void 0 : data.writerId,
        },
    });
    data.title = `${store === null || store === void 0 ? void 0 : store.storeName} 문자서비스 신청`;
    return data;
});
// 최고관리자 소복 매니저 문자 일괄전송
const sendMessage = (writerId, content) => __awaiter(void 0, void 0, void 0, function* () {
    // 문자 전송 신청자의 매장 및 매장id 탐색
    const writerStore = yield prisma.store.findUnique({
        where: {
            ownerId: writerId,
        },
    });
    console.log(writerStore);
    const storeId = writerStore === null || writerStore === void 0 ? void 0 : writerStore.id;
    // 해당 매장에서 스탬프 적립 승인을 받은 고객 탐색
    const customer = yield prisma.stamp.findMany({
        where: {
            timestamp: { not: null },
            storeId: storeId,
            store: { not: null },
            tourId: { not: null },
            tour: { not: null },
        },
    });
    console.log(customer);
    // 고객 id 배열에 스탬프를 적립한 고객의 id를 push
    const customerId = [];
    for (let i = 0; i < customer.length; i++) {
        customerId.push(customer[i].customerId);
    }
    console.log(customerId);
    // 스탬프를 적립한 고객 id 배열에서 중복값을 제거
    const set = new Set(customerId);
    const uniqueCustomerId = [...set];
    console.log(uniqueCustomerId);
    // 스탬프를 적립한 곡객들의 전화번호가 모인 배열 생송
    let customerPhone = [];
    for (let i = 0; i < uniqueCustomerId.length; i++) {
        const customer = yield prisma.customer.findUnique({
            where: {
                id: uniqueCustomerId[i],
            },
        });
        // 전화번호 문자열 정제
        let phone = customer === null || customer === void 0 ? void 0 : customer.phone;
        let replacedPhone = phone.replace(/-/g, ""); // "-" globally replaced
        customerPhone.push(replacedPhone); // 배열에 값 추가
    }
    console.log(typeof customerPhone, "customerPhone: ", customerPhone);
    // 배열 안 전화번호를 하나의 스트링으로 합침
    const customerPhoneResult = customerPhone.join();
    console.log(customerPhoneResult);
    // 알리고 문자 api 호출
    let data = new form_data_1.default();
    data.append("key", "5hs408olr441l1gojp90yf2lqvcbkwi0");
    data.append("user_id", "sobok");
    data.append("sender", "01025636996");
    data.append("receiver", customerPhoneResult);
    data.append("msg", content);
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://apis.aligo.in/send/",
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const axiosResult = () => __awaiter(void 0, void 0, void 0, function* () {
        const promise = axios_1.default.request(config);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    });
    return axiosResult();
});
// 최고관리자 소복 매니저 카카오톡(친구톡) 일괄전송
const sendKakao = (writerId, content) => __awaiter(void 0, void 0, void 0, function* () {
    // 문자 전송 신청자의 매장 및 매장id 탐색
    const writerStore = yield prisma.store.findUnique({
        where: {
            ownerId: writerId,
        },
    });
    console.log(writerStore);
    const storeId = writerStore === null || writerStore === void 0 ? void 0 : writerStore.id;
    // 해당 매장에서 스탬프 적립 승인을 받은 고객 탐색
    const customer = yield prisma.stamp.findMany({
        where: {
            timestamp: { not: null },
            storeId: storeId,
            store: { not: null },
            tourId: { not: null },
            tour: { not: null },
        },
    });
    // 고객 id 배열에 스탬프를 적립한 고객의 id를 push
    const customerId = [];
    for (let i = 0; i < customer.length; i++) {
        customerId.push(customer[i].customerId);
    }
    // 스탬프를 적립한 고객 id 배열에서 중복값을 제거
    const set = new Set(customerId);
    const uniqueCustomerId = [...set];
    console.log(uniqueCustomerId);
    // 스탬프를 적립한 곡객들의 전화번호가 모인 배열 생성
    let customerPhone = [];
    for (let i = 0; i < uniqueCustomerId.length; i++) {
        const customer = yield prisma.customer.findUnique({
            where: {
                id: uniqueCustomerId[i],
            },
        });
        // 전화번호 문자열 정제
        let phone = customer === null || customer === void 0 ? void 0 : customer.phone;
        let replacedPhone = phone.replace(/-/g, ""); // "-" globally replaced
        customerPhone.push(replacedPhone); // 배열에 값 추가
    }
    // 알리고 토큰 생성 api 호출
    let data = new form_data_1.default();
    data.append("apikey", "5hs408olr441l1gojp90yf2lqvcbkwi0");
    data.append("userid", "sobok");
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://kakaoapi.aligo.in/akv10/token/create/30/s/",
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const axiosResult = () => __awaiter(void 0, void 0, void 0, function* () {
        const promise = axios_1.default.request(config);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    });
    const token = yield axiosResult();
    // 알리고 친구톡 일괄전송 api
    let newData = new form_data_1.default();
    newData.append("apikey", "5hs408olr441l1gojp90yf2lqvcbkwi0");
    newData.append("userid", "sobok");
    newData.append("token", token.token);
    newData.append("senderkey", "28761cda9b6c4062146443a53dcdbd29a057fcb7");
    newData.append("sender", "01025636996");
    for (let i = 0; i < customerPhone.length; i++) {
        newData.append(`receiver_${i + 1}`, customerPhone[i]);
        newData.append(`subject_${i + 1}`, "[SOBOK] 친구톡입니다.");
        newData.append(`message_${i + 1}`, content);
    }
    let configuration = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://kakaoapi.aligo.in/akv10/friend/send/ ",
        headers: Object.assign({}, newData.getHeaders()),
        data: newData,
    };
    const newAxiosResult = () => __awaiter(void 0, void 0, void 0, function* () {
        const promise = axios_1.default.request(configuration);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    });
    return newAxiosResult();
});
// 최고관리자 공지사항 작성
const createNotice = (createNoticeDTO, date, path) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.notice.create({
        data: {
            title: createNoticeDTO.title,
            content: createNoticeDTO.content,
            image: path,
            timestamp: date,
        },
    });
    return data;
});
// 최고관리자 문의사항 전체 조회
const getAllInquiry = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.inquiry.findMany();
    console.log("getAllInquiry");
    for (let i = 0; i < data.length; i++) {
        // 고객 유저의 문의사항일 경우
        if (data[i].customerId && data[i].ownerId === null) {
            console.log("customer");
            const customer = yield prisma.customer.findUnique({
                where: {
                    id: data[i].customerId,
                },
            });
            data[i].who = "일반";
            data[i].name = customer === null || customer === void 0 ? void 0 : customer.name;
            data[i].phone = customer === null || customer === void 0 ? void 0 : customer.phone;
        }
        if (data[i].ownerId && data[i].customerId === null) {
            console.log("owner");
            const owner = yield prisma.store_Owner.findUnique({
                where: {
                    id: data[i].ownerId,
                },
            });
            data[i].who = "점주";
            data[i].name = owner === null || owner === void 0 ? void 0 : owner.director;
            data[i].phone = owner === null || owner === void 0 ? void 0 : owner.phone;
        }
    }
    return data;
});
const managerService = {
    managerSignup,
    managerSignIn,
    grantOwnerSignUp,
    findManagerById,
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
exports.default = managerService;
//# sourceMappingURL=managerService.js.map