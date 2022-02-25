import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../../repositories/interfaces/Users";

import { HandleErrors } from "../../utils/HandleErrors";

export default class AccessTokenUsers {
  constructor(private repository: Users) {}

  execute = async (email: string, password: string) => {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new HandleErrors(404, "The user is not found");
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      throw new HandleErrors(400, "The password is invalid");
    }

    return jwt.sign({ id: user.id }, process.env.SECRET_JWT, {
      expiresIn: "1d",
    });
  };
}
