import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import UsersRepository from "../repositories/implementation/UsersRepository";
import { FindByIdUsers } from "../useCases/Users";

type verifyToken = {
  id: number;
  exp?: number | undefined;
  iat?: number | undefined;
};

async function verifyUser(id: number) {
  const usersRepository = new UsersRepository();
  const findByIdUsersCase = new FindByIdUsers(usersRepository);
  const result = await findByIdUsersCase.execute(id);
  
  return result;
}

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers || !req.headers.authorization) {
      return res
        .status(400)
        .json({ message: "The authorization parameter is mandatory" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const verifyTokenJWT = jwt.verify(
      token,
      process.env.SECRET_JWT
    ) as verifyToken;

    await verifyUser(Number(verifyTokenJWT.id));

    next();
  } catch (error) {
    return res
      .status(error.code || 400)
      .json({ message: error.message || "Unexpected error." });
  }
}
