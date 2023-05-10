import express, { Request, Response } from "express";

const app = express();

app.use(express.json()); // bodyParser가 express 최근 버전에서 deprecated되어서 다음과 같이 처리해줘야함
app.use(express.urlencoded({ extended: false }));

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

export default app;
