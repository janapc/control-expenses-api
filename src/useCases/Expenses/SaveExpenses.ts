import { HandleErrors } from './../../utils/HandleErrors';
import Expenses from "../../repositories/interfaces/Expenses";
import DomainExpenses from "../../domain/Expenses";

import { validateCategory, validateDate } from "../../validation";

export default class SaveExpenses {
  constructor(private repository: Expenses) {}

  execute = async (data: DomainExpenses) => {
    if (!validateDate(data.date)) {
      throw new HandleErrors(400, "The date is invalid");
    }

    const findByDescription = await this.repository.findByDescription(
      data.description
    );

    if (findByDescription.length) {
      const dateMonth = data.date.slice(3, data.date.length);
      const findByMonth = findByDescription.find(
        (expense) => expense.date.slice(3, expense.date.length) === dateMonth
      );
      if (findByMonth) {
        throw new HandleErrors(400,"This expense already be included");
      }
    }

    const category = data.category ? data.category.toLowerCase() : undefined;

    if (category && !validateCategory(category)) {
      throw new HandleErrors(400, "The category is invalid");
    }

    await this.repository.save({
      ...data,
      category,
    });
  };
}
