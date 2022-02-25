import { validateDate } from "./validateDate";

describe("ValidateDate Validation", () => {
  it("Should return an error if the parameter is empty", () => {
    expect(() => validateDate("")).toThrowError("This date is invalid");
  });

  it("Should return false if date parameter is invalid", () => {
    const validation = validateDate("1990/12/10");

    expect(validation).toBeFalsy();
  });
  
  it("Should return true if date parameter is valid with slash", () => {
    const validation = validateDate("10/12/1990");

    expect(validation).toBeTruthy();
  });
});
