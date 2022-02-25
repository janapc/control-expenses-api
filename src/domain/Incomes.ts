interface IncomesProps {
  id?: number;
  description: string;
  value: number;
  date: string;
  createdDate?: Date;
}

export default class Incomes {
  id?: number;
  description: string;
  value: number;
  date: string;
  createdDate?: Date;

  constructor(props: IncomesProps) {
    Object.assign(this, props);
  }
}
