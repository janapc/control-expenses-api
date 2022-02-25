import { validateEmail } from "./validateEmail";

describe("ValidateEmail Validtion", () => {
  it("Should return false if email is invalid", () => {
    const result = validateEmail("teste.com");

    expect(result).toBeFalsy();
  });

  it("Should return true if email is valid", () => {
    const result = validateEmail("teste@test.com");

    expect(result).toBeTruthy();
  });
});
