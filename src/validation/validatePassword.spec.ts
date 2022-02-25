import { validatePassword } from "./validatePassword";

describe("ValidatePassword Validation", () => {
  it("Should return false if password is invalid", () => {
    const result = validatePassword("24234");

    expect(result).toBeFalsy();
  });

  it("Should return true if password is valid", () => {
    const result = validatePassword("24234123Test");

    expect(result).toBeTruthy();
  });
});
