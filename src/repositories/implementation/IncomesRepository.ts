import { getRepository, Repository, Like } from "typeorm";

import entityIncomes from "../../database/entity/Incomes";
import DomainIncomes from "../../domain/Incomes";
import Incomes from "../interfaces/Incomes";

export default class IncomesRepository implements Incomes {
  private ormRepository: Repository<entityIncomes>;

  constructor() {
    this.ormRepository = getRepository(entityIncomes);
  }

  save = async (data: DomainIncomes) => {
    await this.ormRepository.save(data);
  };

  findByDescription = async (description: string) => {
    const result = await this.ormRepository.find({
      where: {
        description,
      },
    });

    return result;
  };

  findAll = async () => {
    const result = await this.ormRepository.find(undefined);
    
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

  update = async (data: DomainIncomes, id: number) => {
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
