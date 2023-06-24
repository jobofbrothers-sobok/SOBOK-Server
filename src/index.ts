import express, { NextFunction, Request, Response } from "express";
import router from "./router";
import app from "./app";
import session from "express-session";
import cors from "cors";

const PORT = 5000; // 사용할 port를 3000번으로 설정

app.use(express.json()); // express 에서 request body를 json 으로 받아오겠다.

//* HTTP method - GET
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server listening");
});

app.use(
  session({
    secret: "",
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: "localhost",
      path: "/",
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    },
  }),
  router
);

app.use(
  cors({
    origin: "https://",
  })
);
app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});
