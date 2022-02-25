import * as utilsErros from "../../utils/HandleErrors";
import AccessTokenUsers from "./AccessTokenUsers";
import Users from "../../repositories/interfaces/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRepository: Users = {
  save: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
};

const mockData = {
  id: 2,
  email: "test@test.com",
  name: "test",
  password: "TTtest123",
};

describe("AccessTokenUsers UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if not found user", async () => {
    jest.spyOn(mockRepository, "findByEmail");
    jest.spyOn(utilsErros, "HandleErrors");

    const accessTokenUser = new AccessTokenUsers(mockRepository);

    await expect(
      accessTokenUser.execute("test@test.com", "TTtest123")
    ).rejects.toThrowError("The user is not found");

    expect(mockRepository.findByEmail).toBeCalledTimes(1);
    expect(mockRepository.findByEmail).toBeCalledWith("test@test.com");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      404,
      "The user is not found"
    );
  });

  it("Should return error if password is invalid", async () => {
    jest.spyOn(mockRepository, "findByEmail").mockResolvedValueOnce(mockData);
    jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(null);
    jest.spyOn(utilsErros, "HandleErrors");

    const accessTokenUser = new AccessTokenUsers(mockRepository);

    await expect(
      accessTokenUser.execute("test@test.com", "TTtest1233")
    ).rejects.toThrowError("The password is invalid");

    expect(mockRepository.findByEmail).toBeCalledTimes(1);
    expect(mockRepository.findByEmail).toBeCalledWith("test@test.com");
    expect(bcrypt.compareSync).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400, "The password is invalid"
    );
  });

  it("Should return accessToken", async () => {
    jest.spyOn(mockRepository, "findByEmail").mockResolvedValueOnce(mockData);
    jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(true);
    jest.spyOn(jwt, "sign").mockImplementation(() => 'sdadans9890');

    const accessTokenUser = new AccessTokenUsers(mockRepository);

    await expect(
      accessTokenUser.execute("test@test.com", "TTtest1233")
    ).resolves.toEqual("sdadans9890");

    expect(mockRepository.findByEmail).toBeCalledTimes(1);
    expect(mockRepository.findByEmail).toBeCalledWith("test@test.com");
    expect(bcrypt.compareSync).toBeCalledTimes(1);
    expect(jwt.sign).toBeCalledTimes(1);
  });
});
