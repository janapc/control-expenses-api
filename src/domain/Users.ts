interface UsersProps {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export default class Users {
  id?: number;
  name: string;
  email: string;
  password: string;

  constructor(props: UsersProps) {
    Object.assign(this, props);
  }
}
