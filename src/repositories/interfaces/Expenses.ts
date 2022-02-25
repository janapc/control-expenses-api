import DomainExpenses from "../../domain/Expenses";

export default interface Expenses {
  findAll: () => Promise<DomainExpenses[] | []>;
  save: (data: DomainExpenses) => Promise<void>;
  findByDescription: (description: string) => Promise<DomainExpenses[] | []>;
  findById: (id: number) => Promise<DomainExpenses | undefined>;
  update: (data: DomainExpenses, id: number) => Promise<void>;
  delete: (id: number) => Promise<void>;
  searchByDescription: (description: string) => Promise<DomainExpenses[] | []>;
  searchByDate: (month: string, year: string) => Promise<DomainExpenses[] | []>;
}
