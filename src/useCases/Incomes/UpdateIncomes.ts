import Incomes from "../../repositories/interfaces/Incomes";

import { HandleErrors } from './../../utils/HandleErrors';
import { validateDate } from "../../validation";

import DomainIncomes from "../../domain/Incomes";

export default class UpdateIncomes {
  constructor(private repository: Incomes) {}

  execute = async (data: Omit<DomainIncomes, "id">, id: number) => {
    if (!validateDate(data.date)) {
      throw new HandleErrors(400, "The date is invalid");
    }

    const findById = await this.repository.findById(id);
    
    if (!findById) {
      throw new HandleErrors(404, "Income is not found");
    }

    const findByDescription = await this.repository.findByDescription(
      data.description
    );

    if (findByDescription.length) {
      const month = data.date.split(/\//g)[1];

      const findByMonth = findByDescription.find(
        (income) =>
          income.date.split(/\//g)[1] === month &&
          income.id !== findById.id
      );

      if (findByMonth) {
        throw new HandleErrors(400, "This income already be included");
      }
    }

    await this.repository.update(data, id);
  };
}
