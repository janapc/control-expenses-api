import Incomes from "../../repositories/interfaces/Incomes";

import { HandleErrors } from './../../utils/HandleErrors';

export default class FindByIdIncomes {
  constructor(private repository: Incomes) {}

  execute = async (id: number) => {
    const result = await this.repository.findById(id);
    
    if (!result) {
      throw new HandleErrors(404, "Income is not found");
    }

    return result;
  };
}
