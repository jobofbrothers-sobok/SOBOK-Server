import express, { NextFunction, Request, Response } from "express";
import router from "./router";
import app from "./app";
import expressSession from "express-session";
import fileStore from "session-file-store";
import cors from "cors";
import cookieParser from "cookie-parser";
app.set('trust proxy', true); // 프록시 헤더 신뢰 설정

const PORT = 5000; // 사용할 port를 3000번으로 설정

app.use(express.json()); // express 에서 request body를 json 으로 받아오겠다.

//* HTTP method - GET
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server listening");
});

app.use(cookieParser());

// const filestore = new fileStore();
app.use(
  expressSession({
    secret: "@sobok",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   domain: "localhost",
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    // },
  })
);

app.use("/", router);

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});
