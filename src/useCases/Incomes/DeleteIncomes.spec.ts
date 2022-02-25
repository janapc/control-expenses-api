import Incomes from "../../repositories/interfaces/Incomes";
import DeleteIncomes from "./DeleteIncomes";
import * as utilsErros from "../../utils/HandleErrors";

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

describe("DeleteIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if not fount income", async () => {
    jest.spyOn(mockRepository, "findById").mockResolvedValue(undefined);
    jest.spyOn(utilsErros, "HandleErrors");

    const deleteIncome = new DeleteIncomes(mockRepository);

    await expect(deleteIncome.execute(1)).rejects.toThrow(
      "Income is not found"
    );
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should delete a income", async () => {
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "delete");

    const deleteIncome = new DeleteIncomes(mockRepository);

    await deleteIncome.execute(1);

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.delete).toBeCalledTimes(1);
    expect(mockRepository.delete).toBeCalledWith(1);
  });
});
