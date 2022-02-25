const typeOfCategory = [
  "alimentação",
  "saúde",
  "moradia",
  "transporte",
  "educação",
  "lazer",
  "imprevistos",
  "Outras",
];

export function validateCategory(category: string) {
  if (!category) {
    throw new Error("This category is invalid");
  }

  if (!typeOfCategory.includes(category)) {
    return false;
  }

  return true;
}
