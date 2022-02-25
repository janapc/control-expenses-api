import DomainUsers from "../../domain/Users";

export default interface Users {
  save: (data: DomainUsers) => Promise<void>;
  create: (data: DomainUsers) => Promise<DomainUsers | undefined>;
  findById: (id: number) => Promise<DomainUsers | undefined>;
  findByEmail: (email: string) => Promise<DomainUsers | undefined>;
}
