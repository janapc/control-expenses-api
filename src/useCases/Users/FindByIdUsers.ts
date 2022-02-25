import Users from "../../repositories/interfaces/Users";

import { HandleErrors } from "./../../utils/HandleErrors";

export default class FindByIdUsers {
  constructor(private repository: Users) {}

  execute = async (id: number) => {
    const result = await this.repository.findById(id);

    if (!result) {
      throw new HandleErrors(404, "The user is not found");
    }

    let { password, ...rest } = result;

    return rest;
  };
}
