import Expenses from "../../repositories/interfaces/Expenses";
import DeleteExpenses from "./DeleteExpenses";
import * as utilsErrors from './../../utils/HandleErrors';

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

describe("DeleteExpenses UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if nout found expense", async () => {
    jest.spyOn(mockRepository, "findById").mockResolvedValue(undefined);
    jest.spyOn(utilsErrors, "HandleErrors");

    const deleteExpense = new DeleteExpenses(mockRepository);

    await expect(deleteExpense.execute(2)).rejects.toThrow(
      "Expense is not found"
    );

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(2);
    expect(utilsErrors.HandleErrors).toBeCalledTimes(1);
    expect(utilsErrors.HandleErrors).toBeCalledWith(404, "Expense is not found");
  });

  it("Should delete a expense", async () => {
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "delete");

    const deleteExpense = new DeleteExpenses(mockRepository);

    await deleteExpense.execute(1);

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(mockRepository.delete).toBeCalledTimes(1);
    expect(mockRepository.delete).toBeCalledWith(1);
  });
});
