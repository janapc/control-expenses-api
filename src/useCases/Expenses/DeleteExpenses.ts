import { HandleErrors } from './../../utils/HandleErrors';
import Expenses from "../../repositories/interfaces/Expenses";

export default class DeleteExpenses {
  constructor(private repository: Expenses) {}

  execute = async (id: number) => {
    const findById = await this.repository.findById(id);

    if (!findById) {
      throw new HandleErrors(404, "Expense is not found");
    }

    await this.repository.delete(id);
  };
}
