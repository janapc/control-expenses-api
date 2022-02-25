import { getRepository, Repository, Like } from "typeorm";

import entityExpenses from "../../database/entity/Expenses";
import DomainExpenses from "../../domain/Expenses";
import Expenses from "../interfaces/Expenses";

export default class ExpensesRepository implements Expenses {
  private ormRepository: Repository<entityExpenses>;

  constructor() {
    this.ormRepository = getRepository(entityExpenses);
  }

  findAll = async () => {
    const result = await this.ormRepository.find(undefined);

    return result;
  };

  save = async (data: DomainExpenses) => {
    await this.ormRepository.save(data);
  };

  findByDescription = async (description) => {
    const result = await this.ormRepository.find({
      where: {
        description,
      },
    });

    return result;
  };

  findById = async (id: number) => {
    const result = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return result;
  };

  update = async (data: DomainExpenses, id: number) => {
    await this.ormRepository.update(id, data);
  };

  delete = async (id: number) => {
    await this.ormRepository.delete(id);
  };

  searchByDescription = async (description: string) => {
    const result = await this.ormRepository.find({
      description: Like(`%${description}%`),
    });

    return result;
  };

  searchByDate = async (month: string, year: string) => {
    const result = await this.ormRepository.find({
      date: Like(`%${month}/${year}`),
    });

    return result;
  };
}
