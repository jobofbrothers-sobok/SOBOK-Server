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
const service_1 = require("../service");
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const response_1 = require("../constants/response");
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// 고객 유저 회원가입
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validation의 결과를 바탕으로 분기 처리
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const customerCreateDTO = req.body;
    const termsAgree = req.body.termsAgree;
    if (!termsAgree) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const data = yield service_1.authService.createCustomer(customerCreateDTO);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.SIGNUP_FAIL));
        }
        // jwtHandler 내 sign 함수를 이용해 accessToken 생성
        const accessToken = jwtHandler_1.default.sign(data.id);
        const result = {
            userId: data.id,
            name: data.name,
            accessToken,
        };
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.SIGNUP_SUCCESS, result));
    }
    catch (e) {
        console.log(e);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 회원가입 1
const createOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validation의 결과를 바탕으로 분기 처리
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        console.log(error);
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const image = req.file;
        console.log("req.file : ", req.file);
        console.log("typeof req.file : ", typeof req.file);
        const path = image.path;
        console.log(path);
        const ownerCreateDTO = req.body;
        const loginId = ownerCreateDTO.loginId;
        // const password = ownerCreateDTO.password;
        // const store = ownerCreateDTO.store;
        // const director = ownerCreateDTO.director;
        // const phone = ownerCreateDTO.phone;
        // const email = ownerCreateDTO.email;
        // const address = ownerCreateDTO.address;
        // const licenseNumber = ownerCreateDTO.licenseNumber;
        // const termsAgree = req.body.termsAgree;
        if (!loginId
        // !password ||
        // !store ||
        // !director ||
        // !phone ||
        // !email ||
        // !address ||
        // !licenseNumber
        ) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        console.log("create");
        console.log(typeof loginId, typeof path);
        const data = yield service_1.authService.createOwner(ownerCreateDTO, path);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.OWNER_SIGNUP_1_FAIL));
        }
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.OWNER_SIGNUP_1_SUCCESS, data));
    }
    catch (e) {
        console.log(e);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 회원가입 2(loginId, 나머지 필드)
const patchOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validation의 결과를 바탕으로 분기 처리
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        console.log(error);
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const ownerCreateDTO = req.body;
        const loginId = ownerCreateDTO.loginId;
        const password = ownerCreateDTO.password;
        const store = ownerCreateDTO.store;
        const director = ownerCreateDTO.director;
        const phone = ownerCreateDTO.phone;
        const email = ownerCreateDTO.email;
        const address = ownerCreateDTO.address;
        const licenseNumber = ownerCreateDTO.licenseNumber;
        const termsAgree = req.body.termsAgree;
        const marketingAgree = req.body.marketingAgree;
        if (!loginId ||
            !password ||
            !store ||
            !director ||
            !phone ||
            !email ||
            !address ||
            !licenseNumber ||
            !termsAgree) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        console.log("patch");
        const data = yield service_1.authService.patchOwner(ownerCreateDTO);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.OWNER_SIGNUP_2_FAIL));
        }
        // jwtHandler 내 sign 함수를 이용해 accessToken 생성
        const accessToken = jwtHandler_1.default.sign(data.id);
        const result = {
            userId: data.id,
            storeName: data.store,
            accessToken,
        };
        return res
            .status(constants_1.sc.CREATED)
            .send((0, response_1.success)(constants_1.sc.CREATED, constants_1.rm.OWNER_SIGNUP_2_SUCCESS, result));
    }
    catch (e) {
        console.log(e);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const sortType = {
    CUSTOMER: "customer",
    OWNER: "owner",
};
// 로그인 아이디 중복확인
const checkLoginId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = req.query.sort;
    const loginId = req.body.loginId;
    if (!sort || !loginId) {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    if (sort !== sortType.CUSTOMER && sort !== sortType.OWNER) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    try {
        const data = yield service_1.authService.checkLoginId(sort, loginId);
        if (!data) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.CHECK_LOGINID_FAIL));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.CHECK_LOGINID_SUCCESS, data));
    }
    catch (error) {
        console.log(error);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 유저 로그인
const customerSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const userSigninDTO = req.body;
    try {
        const user = yield service_1.authService.customerSignIn(userSigninDTO);
        if (!user)
            return res.status(constants_1.sc.NOT_FOUND).send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.NOT_FOUND));
        else if (user === constants_1.sc.UNAUTHORIZED)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.INVALID_PASSWORD));
        const tokenUser = user;
        const accessToken = jwtHandler_1.default.sign(tokenUser.id);
        // req.session.save(function () {
        //   req.session.loginId = user.loginId;
        //   router.get("/signout/customer", auth);
        // });
        // 이 req.session 세션이 logout 컨트롤러 호출 시 유지되지 않는 것으로 보인다.
        let result = {
            who: "customer",
            id: tokenUser.id,
            loginId: tokenUser.loginId,
            name: tokenUser.name,
            accessToken,
        };
        if (tokenUser.loginId === "admin") {
            result = {
                who: "manager",
                id: tokenUser.id,
                loginId: tokenUser.loginId,
                name: tokenUser.name,
                accessToken,
            };
        }
        res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SIGNIN_SUCCESS, result));
    }
    catch (e) {
        console.log(error);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 로그인
const ownerSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const userSigninDTO = req.body;
    try {
        const user = yield service_1.authService.ownerSignIn(userSigninDTO);
        if (!user)
            return res.status(constants_1.sc.NOT_FOUND).send((0, response_1.fail)(constants_1.sc.NOT_FOUND, constants_1.rm.NOT_FOUND));
        else if (user === constants_1.sc.UNAUTHORIZED)
            return res
                .status(constants_1.sc.UNAUTHORIZED)
                .send((0, response_1.fail)(constants_1.sc.UNAUTHORIZED, constants_1.rm.INVALID_PASSWORD));
        const tokenUser = user;
        const accessToken = jwtHandler_1.default.sign(tokenUser.id);
        const result = {
            who: "owner",
            id: tokenUser.id,
            loginId: tokenUser.loginId,
            storeId: tokenUser.storeId,
            store: tokenUser.store,
            director: tokenUser.director,
            authorized: tokenUser.authorized,
            stampAuthorized: tokenUser.stampAuthorized,
            pending: tokenUser.pending,
            accessToken,
        };
        res.status(constants_1.sc.OK).send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SIGNIN_SUCCESS, result));
    }
    catch (e) {
        console.log(error);
        // 서버 내부에서 오류 발생
        res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// // 고객 유저 로그아웃
// const customerSignOut = async (req: Request, res: Response) => {
//   const id = req.user.id;
//   console.log(req.session);
//   console.log(req.session.loginId); // undefined 출력
//   if (!req.session.loginId) {
//     res.status(400).send({ data: null, message: "not authorized" });
//   } else {
//     req.session.destroy();
//     const destroy = req.session.loginId;
//     res.json({ data: null, message: "ok", destroy });
//   }
// };
// 고객 유저 회원정보 수정
const customerUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const customerupdateDTO = req.body;
    const id = req.user.id;
    const image = req.file;
    const path = image.path;
    try {
        const updatedUserId = yield service_1.authService.customerUpdate(id, customerupdateDTO, path);
        if (!updatedUserId) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
        }
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.UPDATE_USER_SUCCESS, { id: updatedUserId }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 회원정보 수정
const ownerUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res
            .status(constants_1.sc.BAD_REQUEST)
            .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.BAD_REQUEST));
    }
    const ownerUpdateDTO = req.body;
    const id = req.user.id;
    const image = req.files;
    console.log(image);
    const path1 = image.file1[0].path;
    const path2 = image.file2[0].path;
    console.log(path1);
    console.log(path2);
    const password = ownerUpdateDTO.password;
    const director = ownerUpdateDTO.director;
    const phone = ownerUpdateDTO.phone;
    const email = ownerUpdateDTO.email;
    const address = ownerUpdateDTO.address;
    const licenseNumber = ownerUpdateDTO.licenseNumber;
    try {
        if (!password ||
            !director ||
            !phone ||
            !email ||
            !address ||
            !licenseNumber) {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
        }
        const updatedUserId = yield service_1.authService.ownerUpdate(+id, ownerUpdateDTO, path1, path2);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.UPDATE_USER_SUCCESS, { id: updatedUserId }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 유저 회원정보 찾기 및 비밀번호 재설정
const findCustomerByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (!email || email === "") {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const customer = yield service_1.authService.findCustomerByEmail(email);
        if (customer) {
            // 10글자 string
            const token = crypto_1.default.randomBytes(5).toString("hex");
            const data = {
                token,
                customerId: customer.id,
                ttl: 300, // Time To Live 5분
            };
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_ID,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
            const name = customer.name;
            const loginId = customer.loginId;
            const emailOptions = {
                from: process.env.GMAIL_ID,
                to: email,
                subject: "[SOBOK] 회원님의 ID/비밀번호 정보입니다.",
                html: `<p>안녕하세요, SOBOK입니다.</p>` +
                    `<p>'${name}'님의 아이디 : ${loginId} </p>` +
                    `초기화된 임시 비밀번호 : <b>${token}</b> </p>` +
                    `<p>(임시 비밀번호는 로그인 후 변경해주세요.)</p>` +
                    `<p>감사합니다. </p>`,
            };
            transporter.sendMail(emailOptions);
            // 비밀번호 재설정
            const resetPassword = yield service_1.authService.resetCustomerPw(customer.id, token);
            return res
                .status(constants_1.sc.OK)
                .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SEND_EMAIL_RESET_PW_SUCCESS, resetPassword));
        }
        else {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_CUSTOMER_BY_EMAIL_FAIL));
        }
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 회원정보 찾기 및 비밀번호 재설정
const findOwnerByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (!email || email === "") {
        return res.status(constants_1.sc.BAD_REQUEST).send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.NULL_VALUE));
    }
    try {
        const owner = yield service_1.authService.findOwnerByEmail(email);
        if (owner) {
            // 10글자 string
            const token = crypto_1.default.randomBytes(5).toString("hex");
            const data = {
                token,
                ownerId: owner.id,
                ttl: 300, // Time To Live 5분
            };
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_ID,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
            const name = owner.director;
            const loginId = owner.loginId;
            const emailOptions = {
                from: process.env.GMAIL_ID,
                to: email,
                subject: "[SOBOK] 회원님의 ID/비밀번호 정보입니다.",
                html: `<p>안녕하세요, SOBOK입니다.</p>` +
                    `<p>'${name}' 담당자님의 아이디 : <b>${loginId}</b> </p>` +
                    `초기화된 임시 비밀번호 : <b>${token}</b> </p>` +
                    `<p>(임시 비밀번호는 로그인 후 변경해주세요.)</p>` +
                    `<p>감사합니다. </p>`,
            };
            transporter.sendMail(emailOptions);
            // 비밀번호 재설정
            const resetPassword = yield service_1.authService.resetOwnerPw(owner.id, token);
            return res
                .status(constants_1.sc.OK)
                .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.SEND_EMAIL_RESET_PW_SUCCESS, resetPassword));
        }
        else {
            return res
                .status(constants_1.sc.BAD_REQUEST)
                .send((0, response_1.fail)(constants_1.sc.BAD_REQUEST, constants_1.rm.GET_OWNER_BY_EMAIL_FAIL));
        }
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 고객 유저 탈퇴
const customerDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const deletedUserId = yield service_1.authService.customerDelete(id);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_USER_SUCCESS, { id: deletedUserId }));
    }
    catch (error) {
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 회원탈퇴
const ownerDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const deletedUserId = yield service_1.authService.ownerDelete(+id);
        return res
            .status(constants_1.sc.OK)
            .send((0, response_1.success)(constants_1.sc.OK, constants_1.rm.DELETE_USER_SUCCESS, { id: deletedUserId }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(constants_1.sc.INTERNAL_SERVER_ERROR)
            .send((0, response_1.fail)(constants_1.sc.INTERNAL_SERVER_ERROR, constants_1.rm.INTERNAL_SERVER_ERROR));
    }
});
// 점주 유저 탈퇴
const authController = {
    createCustomer,
    createOwner,
    patchOwner,
    checkLoginId,
    customerSignIn,
    ownerSignIn,
    // customerSignOut,
    customerUpdate,
    ownerUpdate,
    findCustomerByEmail,
    findOwnerByEmail,
    customerDelete,
    ownerDelete,
};
exports.default = authController;
//# sourceMappingURL=authController.js.map