import { getRepository, Repository } from "typeorm";

import entityUsers from "../../database/entity/Users";
import DomainUsers from "../../domain/Users";
import Users from "../interfaces/Users";

export default class UsersRepository implements Users {
  private ormRepository: Repository<entityUsers>;

  constructor() {
    this.ormRepository = getRepository(entityUsers);
  }

  save = async (data: DomainUsers) => {
    await this.ormRepository.save(data);
  };

  create = async (data: DomainUsers) => {
    const result = await this.ormRepository.create(data);
    
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

  findByEmail = async (email: string) => {
    const result = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return result;
  };
}
