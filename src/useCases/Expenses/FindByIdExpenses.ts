import { HandleErrors } from './../../utils/HandleErrors';
import Expenses from "../../repositories/interfaces/Expenses";

export default class FindByIdExpenses {
  constructor(private repository: Expenses) {}

  execute = async (id: number) => {
    const result = await this.repository.findById(id);

    if(!result) {
      throw new HandleErrors(404, 'Expense is not found');
    }

    return result;
  };
}
