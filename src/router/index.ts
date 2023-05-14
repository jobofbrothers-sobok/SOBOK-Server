import { Router } from "express";
import customerRouter from "./customerRouter";
import ownerRouter from "./ownerRouter";
import { auth } from "../middlewares";

const router: Router = Router();

router.use("/customer", customerRouter);
router.use("/owner", ownerRouter);

export default router;
