import Expenses from "../../repositories/interfaces/Expenses";
import FindAllExpenses from "./FindAllExpenses";

const mockRepository: Expenses = {
  findAll: async () => {
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
  save: jest.fn(),
  findByDescription: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  searchByDescription: jest.fn(),
  searchByDate: jest.fn(),
};

describe("FindAllExpenses UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should all expense", async () => {
    jest.spyOn(mockRepository, "findAll");

    const findAllExpense = new FindAllExpenses(mockRepository);

    const result = await findAllExpense.execute();

    expect(mockRepository.findAll).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ]);
  });

  it("Should return list empty", async () => {
    jest.spyOn(mockRepository, "findAll").mockResolvedValue([]);

    const findAllExpense = new FindAllExpenses(mockRepository);

    const result = await findAllExpense.execute();

    expect(mockRepository.findAll).toBeCalledTimes(1);
    expect(result).toEqual([]);
  });
});
