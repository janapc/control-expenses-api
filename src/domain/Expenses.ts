interface ExpensesProps {
  id?: number;
  description: string;
  value: number;
  date: string;
  category?: string;
  createdDate?: Date;
}

export default class Expenses {
  id?: number;
  description: string;
  value: number;
  date: string;
  category?: string;
  createdDate?: Date;

  constructor(props: ExpensesProps) {
    Object.assign(this, props);
  }
}
