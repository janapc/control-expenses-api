import SaveIncomes from "./SaveIncomes";
import * as utilsErros from "../../utils/HandleErrors";
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
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  searchByDescription: jest.fn(),
  searchByDate: jest.fn(),
};

const mockData = {
  description: "test",
  value: 100,
  date: "10/10/1990",
};

describe("SaveIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return error if date is invalid", async () => {
    jest.spyOn(validation, "validateDate").mockReturnValueOnce(false);
    jest.spyOn(utilsErros, "HandleErrors");

    const clonemockData = { ...mockData, date: "10/9/1991" };

    const saveIncome = new SaveIncomes(mockRepository);

    await expect(saveIncome.execute(clonemockData)).rejects.toThrowError(
      "The date is invalid"
    );

    expect(validation.validateDate).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should return error if find income with description equal and id different", async () => {
    jest.spyOn(mockRepository, "findByDescription");
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(utilsErros, "HandleErrors");

    const saveIncome = new SaveIncomes(mockRepository);

    await expect(saveIncome.execute(mockData)).rejects.toThrowError(
      "This income already be included"
    );

    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
  });

  it("Should save a income", async () => {
    jest.spyOn(mockRepository, "findByDescription").mockResolvedValue([]);
    jest.spyOn(validation, "validateDate").mockReturnValue(true);
    jest.spyOn(mockRepository, "save");

    const saveIncome = new SaveIncomes(mockRepository);
    await saveIncome.execute(mockData);

    expect(mockRepository.findByDescription).toBeCalledTimes(1);
    expect(mockRepository.findByDescription).toBeCalledWith("test");
    expect(mockRepository.save).toBeCalledTimes(1);
    expect(mockRepository.save).toBeCalledWith(mockData);
  });
});
