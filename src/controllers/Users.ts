import { Request, Response } from "express";

import DomainUsers from "../domain/Users";
import Users from "../repositories/interfaces/Users";
import UsersRepository from "../repositories/implementation/UsersRepository";

import { SaveUsers, FindByIdUsers, AccessTokenUsers } from "../useCases/Users";

export default class UsersController {
  private usersRepository: Users;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  saveUsers = async (req: Request, res: Response) => {
    try {
      const data: DomainUsers = req.body;

      const saveUsersCase = new SaveUsers(this.usersRepository);
      await saveUsersCase.execute(data);

      return res.status(201).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  findByIdUsers = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const findByIdUsersCase = new FindByIdUsers(this.usersRepository);
      const result = await findByIdUsersCase.execute(Number(id));

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  accessTokenUsers = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const accessTokenUsersCase = new AccessTokenUsers(this.usersRepository);
      const accessToken = await accessTokenUsersCase.execute(email, password);

      return res.status(200).json({ accessToken });
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };
}
