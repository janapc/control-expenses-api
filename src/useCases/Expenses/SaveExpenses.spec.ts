import Expenses from "../../repositories/interfaces/Expenses";
import SaveExpenses from "./SaveExpenses";
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
  findById: jest.fn(),
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

describe("SaveExpenses UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if the date is invalid", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const saveExpense = new SaveExpenses(mockRepository);

    const cloneMockData = { ...mockData, date: "10/1/1990" };

    await expect(saveExpense.execute(cloneMockData)).rejects.toThrow(
      "The date is invalid"
    );
    expect(validation.validateDate).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(400, "The date is invalid");
  });

  it("Should return error if the expense already exists", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(utilsErros, "HandleErrors");

    const saveExpense = new SaveExpenses(mockRepository);

    await expect(saveExpense.execute(mockData)).rejects.toThrow(
      "This expense already be included"
    );

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400,
      "This expense already be included"
    );
  });

  it("Should return error if the category is invalid", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(validation, "validateCategory").mockReturnValue(false);
    jest.spyOn(mockRepository, "findByDescription").mockResolvedValue([]);
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, category: "test" };

    const saveExpense = new SaveExpenses(mockRepository);

    await expect(saveExpense.execute(cloneMockData)).rejects.toThrow(
      "The category is invalid"
    );

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(validation.validateCategory).toBeCalledTimes(1);
    expect(validation.validateCategory).toBeCalledWith("test");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400,
      "The category is invalid"
    );
  });

  it("Should save new expense", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(validation, "validateCategory").mockReturnValue(true);
    jest.spyOn(mockRepository, "findByDescription").mockResolvedValue([]);
    jest.spyOn(mockRepository, "save");
    jest.spyOn(utilsErros, "HandleErrors");

    const saveExpense = new SaveExpenses(mockRepository);

    await saveExpense.execute(mockData);

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(validation.validateCategory).toBeCalledTimes(1);
    expect(validation.validateCategory).toBeCalledWith("outras");
    expect(mockRepository.save).toBeCalledTimes(1);
    expect(mockRepository.save).toBeCalledWith(mockData);
  });
});
