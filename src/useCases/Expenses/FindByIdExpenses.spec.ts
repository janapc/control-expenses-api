import Expenses from "../../repositories/interfaces/Expenses";
import FindByIdExpenses from "./FindByIdExpenses";
import * as utilsErros from "../../utils/HandleErrors";

const mockRepository: Expenses = {
  findAll: jest.fn(),
  save: jest.fn(),
  findByDescription: jest.fn(),
  findById: async () => {
    return {
      id: 1,
      description: "test",
      value: 90,
      date: "10/10/1991",
      category: "outras",
    };
  },
  update: jest.fn(),
  delete: jest.fn(),
  searchByDescription: jest.fn(),
  searchByDate: jest.fn(),
};

describe("FindByIdExpenses UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if not found expense", async () => {
    jest.spyOn(mockRepository, "findById").mockResolvedValue(undefined);
    jest.spyOn(utilsErros, "HandleErrors");

    const findByIdExpense = new FindByIdExpenses(mockRepository);

    await expect(findByIdExpense.execute(2)).rejects.toThrow(
      "Expense is not found"
    );

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(2);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(404, "Expense is not found");
  });

  it("Should return a expense", async () => {
    jest.spyOn(mockRepository, "findById");

    const findByIdExpense = new FindByIdExpenses(mockRepository);

    const result = await findByIdExpense.execute(1);

    expect(result).toEqual({
      id: 1,
      description: "test",
      value: 90,
      date: "10/10/1991",
      category: "outras",
    });
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(mockRepository.findById).toBeCalledWith(1);
  });
});
