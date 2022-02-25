import Incomes from "../../repositories/interfaces/Incomes";

export default class FindAllIncomes {
  constructor(private repository: Incomes) {}

  execute = async () => {
    const result = await this.repository.findAll();
    return result;
  };
}
