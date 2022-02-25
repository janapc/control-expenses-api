export function validateDate(date: string) {
  if (!date) {
    throw new Error("This date is invalid");
  }

  const regex = /(\d{2})(\/)(\d{2})(\/)(\d{4})/g;
  if (!date.match(regex)) {
    return false;
  }

  return true;
}
