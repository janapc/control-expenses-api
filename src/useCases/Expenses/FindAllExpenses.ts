import Expenses from "../../repositories/interfaces/Expenses";

export default class FindAllExpenses {
  constructor(private repository: Expenses) {}

  execute = async () => {
    const result = await this.repository.findAll();
    return result;
  };
}
