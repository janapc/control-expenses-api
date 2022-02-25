import { HandleErrors } from "./../../utils/HandleErrors";
import Incomes from "../../repositories/interfaces/Incomes";

export default class DeleteIncomes {
  constructor(private repository: Incomes) {}

  execute = async (id: number) => {
    const findById = await this.repository.findById(id);

    if (!findById) {
      throw new HandleErrors(404, "Income is not found");
    }

    await this.repository.delete(id);
  };
}
