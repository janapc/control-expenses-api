import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export default class Incomes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "numeric" })
  value: number;

  @Column()
  date: string;

  @CreateDateColumn()
  createdDate: Date;
}
