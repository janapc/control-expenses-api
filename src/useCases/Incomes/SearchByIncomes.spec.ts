import Incomes from "../../repositories/interfaces/Incomes";
import SearchByIncomes from "./SearchByIncomes";
import * as utilsErros from "../../utils/HandleErrors";

const mockRepository: Incomes = {
  findAll: jest.fn(),
  save: jest.fn(),
  findByDescription: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  searchByDescription: async () => {
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
  searchByDate: async () => {
    return [
      {
        id: 2,
        description: "banana",
        value: 129,
        date: "10/10/2012",
        category: "outras",
      },
    ];
  },
};

describe("SearchByIncomes UseCases", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("Should return a list of incomes by description", async () => {
    jest.spyOn(mockRepository, "searchByDescription");

    const searchByIncomes = new SearchByIncomes(mockRepository);

    const result = await searchByIncomes.execute({ description: "test" });

    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ]);

    expect(mockRepository.searchByDescription).toBeCalledTimes(1);
    expect(mockRepository.searchByDescription).toBeCalledWith("test");
  });

  it("Should return a list of incomes by date", async () => {
    jest.spyOn(mockRepository, "searchByDate");

    const searchByIncomes = new SearchByIncomes(mockRepository);

    const result = await searchByIncomes.execute({
      date: "10/2012"
    });

    expect(result).toEqual([
      {
        id: 2,
        description: "banana",
        value: 129,
        date: "10/10/2012",
        category: "outras",
      },
    ]);

    expect(mockRepository.searchByDate).toBeCalledTimes(1);
    expect(mockRepository.searchByDate).toBeCalledWith("10", "2012");
  });

  it("Should return a error if the type of search is invalid", async () => {
    jest.spyOn(utilsErros, "HandleErrors");
    jest.spyOn(mockRepository, "searchByDate");
    jest.spyOn(mockRepository, "searchByDescription");

    const searchByIncomes = new SearchByIncomes(mockRepository);

    await expect(
      searchByIncomes.execute({ name: "banana" } as any)
    ).rejects.toThrow("Type of search invalid");
    
    expect(mockRepository.searchByDate).toBeCalledTimes(0);
    expect(mockRepository.searchByDescription).toBeCalledTimes(0);
    expect(utilsErros.HandleErrors).toBeCalledTimes(1);
    expect(utilsErros.HandleErrors).toBeCalledWith(
      400,
      "Type of search invalid"
    );
  });
});
