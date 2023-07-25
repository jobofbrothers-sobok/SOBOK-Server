import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";

const app = express();

const originList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://58.225.75.202:3002/",
];

app.use(express.json()); // bodyParser가 express 최근 버전에서 deprecated되어서 다음과 같이 처리해줘야함
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: originList,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// 이미지 폴더 접근 권한 허용
app.use(
  "/uploads/owner/store/menu",
  express.static("/src/uploads/owner/store/menu")
);
app.use(
  "/uploads/owner/store/notice",
  express.static("/src/uploads/owner/store/notice")
);
app.use(
  "/uploads/owner/store/product",
  express.static("/uploads/owner/store/product")
);
app.use(
  "/uploads/owner/store",
  express.static(path.join("/home/sobok/SOBOK-SERVER", "src"))
);
console.log(path);

app.use("/uploads/customer/review", express.static("/uploads/customer/review"));
app.use("/uploads/manager/notice", express.static("/uploads/manager/notice"));
app.use("/uploads/manager/tour", express.static("/uploads/manager/tour"));

app.use("/uploads/customer", express.static("/uploads/customer"));
app.use("/uploads/owner", express.static(path.join(__dirname, "src")));
app.use("/uploads/manager", express.static("/uploads/manager"));
app.use("/uploads", express.static(path.join(__dirname, "src")));

console.log("*****__dirname: ", __dirname);
// /uploads/owner
// /uploads/customer

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

export default app;
