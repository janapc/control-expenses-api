import { HandleErrors } from "./../../utils/HandleErrors";
import Expenses from "../../repositories/interfaces/Expenses";

export type Query = {
  date?: string;
  description?: string;
};

export default class SearchByExpenses {
  constructor(private repository: Expenses) {}

  execute = async (query: Query) => {
    if (query.description)
      return await this.repository.searchByDescription(query.description);
    else if (query.date && query.date.match(/(\d{2})(\/)(\d{4})/g)) {
      const [month, year] = query.date.split("/");
      return await this.repository.searchByDate(month, year);
    } else throw new HandleErrors(400, "Type of search invalid");
  };
}
