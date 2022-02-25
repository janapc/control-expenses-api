import { Router } from "express";

import UsersController from "../controllers/Users";

const router = Router();
const usersController = new UsersController();

router
  .post("/", usersController.saveUsers)
  .get("/accessToken", usersController.accessTokenUsers)
  .get("/:id", usersController.findByIdUsers);

export default router;
