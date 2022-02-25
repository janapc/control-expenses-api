import { validateCategory } from "./validateCategory";

describe("ValidateCategory Validation", () => {
  it("Should return false if category parameter is invalid", () => {
    const validation = validateCategory("Alimentação");

    expect(validation).toBeFalsy();
  });

  it("Should return an error if the parameter is different of type string", () => {
    expect(() => validateCategory("")).toThrowError("This category is invalid");
  });

  it("Should return true if category parameter is valid", () => {
    const validation = validateCategory("alimentação");

    expect(validation).toBeTruthy();
  });
});
