import * as utilsErros from "../../utils/HandleErrors";
import FindByIdUsers from "./FindByIdUsers";
import Users from "../../repositories/interfaces/Users";

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

describe("FindByIdUsers UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if not found user", async () => {
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(utilsErros, "HandleErrors");

    const findByIdUser = new FindByIdUsers(mockRepository);

    await expect(findByIdUser.execute(1)).rejects.toThrowError(
      "The user is not found"
    );

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      404,
      "The user is not found"
    );
  });

  it("Should return a user by id", async () => {
    jest.spyOn(mockRepository, "findById").mockResolvedValue(mockData);
    jest.spyOn(utilsErros, "HandleErrors");

    const findByIdUser = new FindByIdUsers(mockRepository);

    await expect(findByIdUser.execute(2)).resolves.toEqual({
      id: 2,
      email: "test@test.com",
      name: "test",
    });

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(2);
  });
});
