import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export default class Expenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "numeric" })
  value: number;

  @Column()
  date: string;

  @Column({ default: "outras" })
  category: string;

  @CreateDateColumn()
  createdDate: Date;
}
