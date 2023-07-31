"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const app_1 = __importDefault(require("./app"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
app_1.default.set('trust proxy', true); // 프록시 헤더 신뢰 설정
const PORT = 5000; // 사용할 port를 3000번으로 설정
app_1.default.use(express_1.default.json()); // express 에서 request body를 json 으로 받아오겠다.
//* HTTP method - GET
app_1.default.get("/", (req, res, next) => {
    res.send("Server listening");
});
app_1.default.use((0, cookie_parser_1.default)());
// const filestore = new fileStore();
app_1.default.use((0, express_session_1.default)({
    secret: "@sobok",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   domain: "localhost",
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    // },
}));
app_1.default.use("/", router_1.default);
app_1.default.listen(PORT, () => {
    console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});
//# sourceMappingURL=index.js.map