import Expenses from "../../repositories/interfaces/Expenses";
import DomainExpenses from "../../domain/Expenses";

import { HandleErrors } from "./../../utils/HandleErrors";
import { validateCategory, validateDate } from "../../validation";

export default class UpdateExpenses {
  constructor(private repository: Expenses) {}

  execute = async (data: DomainExpenses, id: number) => {
    if (!validateDate(data.date)) {
      throw new HandleErrors(400, "The date is invalid");
    }

    const findById = await this.repository.findById(id);

    if (!findById) {
      throw new HandleErrors(404, "Expense is not found");
    }

    const findByDescription = await this.repository.findByDescription(
      data.description
    );

    if (findByDescription.length) {
      const month = data.date.split(/\//g)[1];
      const findByMonth = findByDescription.find(
        (expense) =>
          expense.date.split(/\//g)[1] === month && expense.id !== findById.id
      );
      if (findByMonth) {
        throw new HandleErrors(400, "This expense already be included");
      }
    }

    const category = data.category ? data.category.toLowerCase() : undefined;

    if (category && !validateCategory(category)) {
      throw new HandleErrors(400, "The category is invalid");
    }

    await this.repository.update(data, id);
  };
}
