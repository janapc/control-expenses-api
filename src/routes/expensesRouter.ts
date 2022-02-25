import { Router } from "express";

import ExpensesController from "../controllers/Expenses";

const router = Router();
const expensesController = new ExpensesController();

router
  .get("/", expensesController.findAllExpenses)
  .get("/search", expensesController.searchByExpenses)
  .get("/:id", expensesController.findByIdExpenses)
  .post("/", expensesController.saveExpenses)
  .put("/:id", expensesController.updateExpenses)
  .delete("/:id", expensesController.deleteExpenses);

export default router;
