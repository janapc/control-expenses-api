import { Router } from "express";

import verifyToken from "../middleware/verifyToken";

import expensesRouter from "./expensesRouter";
import incomesRouter from "./incomesRouter";
import usersRouter from "./usersRouter";

const router = Router();

router.use("/api/v1/users", usersRouter);
router.use("/api/v1/expenses", verifyToken, expensesRouter);
router.use("/api/v1/incomes", verifyToken, incomesRouter);

export default router;
