import * as utilsErros from "../../utils/HandleErrors";
import FindByIdIncomes from "./FindByIdIncomes";
import Incomes from "../../repositories/interfaces/Incomes";

const mockRepository: Incomes = {
  findAll: jest.fn(),
  save: jest.fn(),
  findByDescription: jest.fn(),
  findById: async (id) => {
    return {
      id,
      description: "test",
      value: 100,
      date: "10/10/1990",
    };
  },
  update: jest.fn(),
  delete: jest.fn(),
  searchByDescription: jest.fn(),
  searchByDate: jest.fn(),
};

describe("FindByIdIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if not found income by id", async () => {
    jest.spyOn(utilsErros, "HandleErrors");
    jest.spyOn(mockRepository, "findById").mockResolvedValue(undefined);

    const findByIdIncome = new FindByIdIncomes(mockRepository);

    await expect(findByIdIncome.execute(1)).rejects.toThrowError(
      "Income is not found"
    );

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).lastCalledWith(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return a income", async () => {
    jest.spyOn(mockRepository, "findById");

    const findByIdIncome = new FindByIdIncomes(mockRepository);

    const result = await findByIdIncome.execute(1);

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).lastCalledWith(1);
    expect(result).toEqual({
      date: "10/10/1990",
      description: "test",
      id: 1,
      value: 100,
    });
  });
});
