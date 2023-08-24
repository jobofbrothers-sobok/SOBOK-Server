import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";

const app = express();
app.set("trust proxy", true); // 프록시 헤더 신뢰 설정
const originList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sobok.co.kr",
  "http://58.225.75.202:3002",
];

app.use(express.json()); // bodyParser가 express 최근 버전에서 deprecated되어서 다음과 같이 처리해줘야함
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: originList,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "PATCH", "POST", "DELETE", "OPTIONS"],
  })
);

app.use("/uploads", express.static("/home/sobok/SOBOK-SERVER/uploads"));

console.log("*****__dirname: ", __dirname);
// /home/sobok/SOBOK-SERVER/dist

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

export default app;
