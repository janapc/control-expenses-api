import Users from "../../repositories/interfaces/Users";

import { HandleErrors } from "./../../utils/HandleErrors";
import { validateEmail, validatePassword } from "../../validation";

import DomainUsers from "../../domain/Users";

export default class SaveUsers {
  constructor(private repository: Users) {}

  execute = async (data: DomainUsers) => {
    if (!validateEmail(data.email)) {
      throw new HandleErrors(400, "The Email is invalid");
    }

    if (!validatePassword(data.password)) {
      throw new HandleErrors(
        400,
        "The Password should contain 8 characters include numbers, letters lower and upper case"
      );
    }

    const findByEmail = await this.repository.findByEmail(data.email);

    if (findByEmail) {
      throw new HandleErrors(400, "The Email already be included");
    }

    const user = await this.repository.create(data);
    
    await this.repository.save(user);
  };
}
