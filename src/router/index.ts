import { Router } from "express";
import customerRouter from "./customerRouter";
import ownerRouter from "./ownerRouter";
import managerRouter from "./managerRouter";
import { auth } from "../middlewares";

const router: Router = Router();

router.use("/customer", customerRouter);
router.use("/owner", ownerRouter);
router.use("/manager", managerRouter);

export default router;
