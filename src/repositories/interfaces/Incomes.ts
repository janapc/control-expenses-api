import DomainIncomes from "../../domain/Incomes";

export default interface Incomes {
  findAll: () => Promise<DomainIncomes[] | undefined>;
  save: (data: DomainIncomes) => Promise<void>;
  findByDescription: (description: string) => Promise<DomainIncomes[] | []>;
  findById: (id: number) => Promise<DomainIncomes | undefined>;
  update: (data: DomainIncomes, id: number) => Promise<void>;
  delete: (id: number) => Promise<void>;
  searchByDescription: (description: string) => Promise<DomainIncomes[] | []>;
  searchByDate: (month: string, year: string) => Promise<DomainIncomes[] | []>;
}
