export function validatePassword(password: string) {
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g;

  if (!password.match(regex)) {
    return false;
  }

  return true;
}
