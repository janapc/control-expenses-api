import * as utilsErros from "../../utils/HandleErrors";
import UpdateIncomes from "./UpdateIncomes";
import * as validation from "../../validation";
import Incomes from "../../repositories/interfaces/Incomes";

jest.mock("../../validation/validateDate");

const mockRepository: Incomes = {
  findAll: jest.fn(),
  save: jest.fn(),
  findByDescription: async () => {
    return [
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    ];
  },
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

const mockData = {
  id: 1,
  description: "test",
  value: 100,
  date: "10/10/1990",
};

describe("UpdateIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if date is invalid", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValueOnce(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, date: "10/9/1991" };

    const updateIncome = new UpdateIncomes(mockRepository);

    await expect(
      updateIncome.execute(cloneMockData, cloneMockData.id)
    ).rejects.toThrowError("The date is invalid");

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if not found income", async () => {
    jest.spyOn(mockRepository, "findById").mockResolvedValueOnce(undefined);
    jest.spyOn(validation, "validateDate").mockReturnValueOnce(true);
    jest.spyOn(utilsErros, "HandleErrors");

    const updateIncome = new UpdateIncomes(mockRepository);

    await expect(
      updateIncome.execute(mockData, mockData.id)
    ).rejects.toThrowError("Income is not found");

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if find income with description equal and id different", async () => {
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(utilsErros, "HandleErrors");

    const cloneMockData = { ...mockData, id: 2 };

    const updateIncome = new UpdateIncomes(mockRepository);

    await expect(
      updateIncome.execute(cloneMockData, cloneMockData.id)
    ).rejects.toThrowError("This income already be included");

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(2);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should update the income", async () => {
    jest.spyOn(mockRepository, "findById");
    jest.spyOn(mockRepository, "update");
    jest.spyOn(mockRepository, "findByDescription").mockResolvedValue([]);
    jest.spyOn(validation, "validateDate").mockReturnValue(true);

    const updateIncome = new UpdateIncomes(mockRepository);

    await updateIncome.execute(mockData, mockData.id);

    expect(mockRepository.findById).toBeCalledTimes(1);
    expect(mockRepository.findById).toBeCalledWith(1);
    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(mockRepository.update).toBeCalledTimes(1);
    expect(mockRepository.update).toBeCalledWith(mockData, 1);
  });
});
