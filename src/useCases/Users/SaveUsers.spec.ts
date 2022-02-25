import * as utilsErros from "../../utils/HandleErrors";
import SaveUsers from "./SaveUsers";
import * as validation from "../../validation";
import Users from "../../repositories/interfaces/Users";

jest.mock("../../validation");

const mockRepository: Users = {
  save: jest.fn(),
  create: jest.fn(),
  findById:  jest.fn(),
  findByEmail: jest.fn(),
};

const mockData = {
  email: "test@test.com",
  name: "test",
  password: "TTtest123",
};

describe("SaveUsers UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if email is invalid", async () => {
    jest.spyOn(validation, "validateEmail").mockReturnValueOnce(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, email: "test.com" };

    const saveUser = new SaveUsers(mockRepository);

    await expect(saveUser.execute(cloneMockData)).rejects.toThrowError(
      "The Email is invalid"
    );

    expect(validation.validateEmail).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(400, "The Email is invalid");
  });

  it("Should return error if email is invalid", async () => {
    jest.spyOn(validation, "validateEmail").mockReturnValueOnce(true);
    jest.spyOn(validation, "validatePassword").mockReturnValueOnce(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, password: "test" };

    const saveUser = new SaveUsers(mockRepository);

    await expect(saveUser.execute(cloneMockData)).rejects.toThrowError(
      "The Password should contain 8 characters include numbers, letters lower and upper case"
    );

    expect(validation.validateEmail).toBeCalledTimes(1);
    expect(validation.validatePassword).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400,
      "The Password should contain 8 characters include numbers, letters lower and upper case"
    );
  });

  it("Should return error if not found user by email", async () => {
    jest.spyOn(validation, "validateEmail").mockReturnValueOnce(true);
    jest.spyOn(validation, "validatePassword").mockReturnValueOnce(true);
    jest.spyOn(utilsErros, "HandleErrors");
    jest
      .spyOn(mockRepository, "findByEmail")
      .mockResolvedValueOnce({ id: 1, ...mockData });

    const cloneMockData = { ...mockData, password: "test" };

    const saveUser = new SaveUsers(mockRepository);

    await expect(saveUser.execute(cloneMockData)).rejects.toThrowError(
      "The Email already be included"
    );

    expect(validation.validateEmail).toBeCalledTimes(1);
    expect(validation.validatePassword).toBeCalledTimes(1);
    expect(mockRepository.findByEmail).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400,
      "The Email already be included"
    );
  });

  it("Should create a new user", async () => {
    jest.spyOn(validation, "validateEmail").mockReturnValueOnce(true);
    jest.spyOn(validation, "validatePassword").mockReturnValueOnce(true);
    jest.spyOn(mockRepository, "findByEmail");
    jest.spyOn(mockRepository, "create").mockResolvedValueOnce(mockData);
    jest.spyOn(mockRepository, "save");

    const saveUser = new SaveUsers(mockRepository);

    await saveUser.execute(mockData);

    expect(validation.validateEmail).toBeCalledTimes(1);
    expect(validation.validatePassword).toBeCalledTimes(1);
    expect(mockRepository.findByEmail).toBeCalledTimes(1);
    expect(mockRepository.create).toBeCalledTimes(1);
    expect(mockRepository.create).toBeCalledWith(mockData);
    expect(mockRepository.save).toBeCalledTimes(1);
    expect(mockRepository.save).toBeCalledWith(mockData);
  });
});
