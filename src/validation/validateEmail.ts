export function validateEmail(email: string) {
  const regex = /\S+@\S+\.\S+/g;

  if (!email.match(regex)) {
    return false;
  }

  return true;
}