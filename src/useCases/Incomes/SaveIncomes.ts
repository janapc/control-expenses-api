import Incomes from "../../repositories/interfaces/Incomes";

import { HandleErrors } from './../../utils/HandleErrors';
import { validateDate } from "../../validation";

import DomainIncomes from "../../domain/Incomes";

export default class SaveIncomes {
  constructor(private repository: Incomes) {}

  execute = async (data: DomainIncomes) => {
    if (!validateDate(data.date)) {
      throw new HandleErrors(400, "The date is invalid");
    }

    const findByDescription = await this.repository.findByDescription(
      data.description
    );

    if (findByDescription.length) {
      const monthAndYear = data.date.slice(3, data.date.length);

      const findByMonth = findByDescription.find(
        (income) => income.date.slice(3, income.date.length) === monthAndYear
      );
      if (findByMonth) {
        throw new HandleErrors(400, "This income already be included");
      }
    }

    await this.repository.save(data);
  };
}
