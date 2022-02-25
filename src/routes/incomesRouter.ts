import { Router } from "express";

import IncomesController from "../controllers/Incomes";

const router = Router();
const incomesController = new IncomesController();

router
  .get("/", incomesController.findAllIncomes)
  .get("/search", incomesController.searchByIncomes)
  .get("/:id", incomesController.findByIdIncomes)
  .post("/", incomesController.saveIncomes)
  .put("/:id", incomesController.updateIncomes)
  .delete("/:id", incomesController.deleteIncomes);

export default router;
