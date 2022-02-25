import Expenses from "../../repositories/interfaces/Expenses";
import UpdateExpenses from "./UpdateExpenses";
import * as validation from "../../validation";
import * as utilsErros from "../../utils/HandleErrors";

jest.mock("../../validation/validateDate");

const mockRepository: Expenses = {
  findAll: jest.fn(),
  save: jest.fn(),
  findByDescription: async () => {
    return [
      {
        id: 1,
        description: "test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ];
  },
  findById: async (id) => {
    return {
      id,
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

const mockData = {
  id: 1,
  description: "test",
  value: 90,
  date: "10/10/1991",
  category: "outras",
};

describe("UpdateExpenses UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if the date is invalid", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const updateExpense = new UpdateExpenses(mockRepository);

    const cloneMockData = { ...mockData, date: "10/1/1990" };

    await expect(
      updateExpense.execute(cloneMockData, cloneMockData.id)
    ).rejects.toThrow("The date is invalid");
    expect(validation.validateDate).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if not found expense", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(mockRepository, "findById").mockReturnValue(undefined);
    jest.spyOn(utilsErros, "HandleErrors");

    const updateExpense = new UpdateExpenses(mockRepository);

    await expect(updateExpense.execute(mockData, mockData.id)).rejects.toThrow(
      "Expense is not found"
    );

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if the expense already exists", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, id: 2 };

    const updateExpense = new UpdateExpenses(mockRepository);

    await expect(
      updateExpense.execute(cloneMockData, cloneMockData.id)
    ).rejects.toThrow("This expense already be included");

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(2);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if the expense already exists", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(validation, "validateCategory").mockReturnValue(false);
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, category: "testing" };

    const updateExpense = new UpdateExpenses(mockRepository);

    await expect(
      updateExpense.execute(cloneMockData, cloneMockData.id)
    ).rejects.toThrow("The category is invalid");

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(validation.validateCategory).toBeCalledTimes(1);
    expect(validation.validateCategory).toBeCalledWith("testing");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should update expense", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(validation, "validateCategory").mockReturnValue(true);
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(mockRepository, "update");

    const updateExpense = new UpdateExpenses(mockRepository);

    await updateExpense.execute(mockData, mockData.id);

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(validation.validateCategory).toBeCalledTimes(1);
    expect(validation.validateCategory).toBeCalledWith("outras");
    expect(mockRepository.update).toBeCalledTimes(1);
    expect(mockRepository.update).toBeCalledWith(mockData, mockData.id);
  });
});
