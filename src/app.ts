import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const originList = ["http://localhost:3000", "http://localhost:3001"];

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
  express.static(__dirname + "/uploads/owner/store/menu")
);
app.use(
  "/uploads/owner/store/notice",
  express.static(__dirname + "/uploads/owner/store/notice")
);
app.use(
  "/uploads/owner/store/product",
  express.static(__dirname + "/uploads/owner/store/product")
);
app.use(
  "/uploads/owner/store",
  express.static(__dirname + "/uploads/owner/store")
);
app.use(
  "/uploads/customer/review",
  express.static(__dirname + "/uploads/customer/review")
);
app.use(
  "/uploads/manager/notice",
  express.static(__dirname + "/uploads/manager/notice")
);
app.use(
  "/uploads/manager/tour",
  express.static(__dirname + "/uploads/manager/tour")
);

app.use("/uploads/customer", express.static(__dirname + "/uploads/customer"));
app.use("/uploads/owner", express.static(__dirname + "/uploads/owner"));
app.use("/uploads/manager", express.static(__dirname + "/uploads/manager"));

console.log("*****__dirname: ", __dirname);
// /uploads/owner
// /uploads/customer

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

export default app;
