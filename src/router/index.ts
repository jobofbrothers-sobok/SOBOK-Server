import { Router } from "express";
import customerRouter from "./customerRouter";
import ownerRouter from "./ownerRouter";
import managerRouter from "./managerRouter";
import mainRouter from "./mainRouter";
import authRouter from "./authRouter";
import { auth } from "../middlewares";

const router: Router = Router();

router.use("/api/auth", authRouter);
router.use("/api/customer", customerRouter);
router.use("/api/owner", ownerRouter);
router.use("/api/manager", managerRouter);
router.use("/api/main", mainRouter);

export default router;
