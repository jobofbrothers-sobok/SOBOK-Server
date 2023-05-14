import { Router } from "express";
import customerRouter from "./customerRouter";
import { auth } from "../middlewares";

const router: Router = Router();

router.use("/customer", customerRouter);

export default router;
