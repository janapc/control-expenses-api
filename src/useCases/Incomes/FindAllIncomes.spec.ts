import Incomes from "../../repositories/interfaces/Incomes";
import FindAllIncomes from "./FindAllIncomes";

const mockRepository: Incomes = {
  findAll: async () => {
    return [
      {
        id: 1,
        description: "test by jest",
        value: 100,
        date: "10/10/1990",
      },
      {
        id: 2,
        description: "testing",
        value: 90,
        date: "11/10/1990",
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

describe("FindAllIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  
  it("Should all the income", async () => {
    jest.spyOn(mockRepository, "findAll");

    const findAllIncome = new FindAllIncomes(mockRepository);

    const result = await findAllIncome.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        id: 1,
        description: "test by jest",
        value: 100,
        date: "10/10/1990",
      },
      {
        id: 2,
        description: "testing",
        value: 90,
        date: "11/10/1990",
      },
    ]);
    expect(mockRepository.findAll).toBeCalledTimes(1);
  });

  it("Should return empty if not have income", async () => {
    jest.spyOn(mockRepository, "findAll").mockResolvedValue([]);

    const findAllIncome = new FindAllIncomes(mockRepository);

    const result = await findAllIncome.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toBeCalledTimes(1);
  });
});
