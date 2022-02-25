import ExpensesRepository from "./ExpensesRepository";
import { getRepository } from "typeorm";
import { mocked } from "jest-mock";

jest.mock("typeorm", () => {
  return {
    getRepository: jest.fn().mockReturnValue({
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }),
    PrimaryGeneratedColumn: jest.fn(),
    Like: (test) => test,
    Column: jest.fn(),
    Entity: jest.fn(),
    ManyToOne: jest.fn(),
    OneToMany: jest.fn(),
    JoinColumn: jest.fn(),
    CreateDateColumn: jest.fn(),
    UpdateDateColumn: jest.fn(),
  };
});

const mockedGetRepo = mocked(getRepository(<jest.Mock>{}));

beforeEach(() => {
  mockedGetRepo.find.mockClear();
  mockedGetRepo.findOne.mockClear();
  mockedGetRepo.save.mockClear();
  mockedGetRepo.update.mockClear();
  mockedGetRepo.delete.mockClear();
});

describe("ExpensesRepository Repositories", () => {
  it("Should return all expense", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
        category: "alimentação",
      },
      {
        id: 2,
        description: "test 2",
        value: 10,
        date: "10/10/1990",
        category: "outras",
      },
    ]);

    const expenseRepository = new ExpensesRepository();
    const result = await expenseRepository.findAll();

    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
        category: "alimentação",
      },
      {
        id: 2,
        description: "test 2",
        value: 10,
        date: "10/10/1990",
        category: "outras",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith(undefined);
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should save an expense", async () => {
    jest.spyOn(mockedGetRepo, "save");

    const expenseRepository = new ExpensesRepository();
    await expenseRepository.save({
      description: "test",
      value: 100,
      date: "10/10/1990",
      category: "alimentação",
    });

    expect(mockedGetRepo.save).toHaveBeenCalledWith({
      description: "test",
      value: 100,
      date: "10/10/1990",
      category: "alimentação",
    });
    expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
  });

  it("Should return all expense with description equal", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
        category: "alimentação",
      },
    ]);

    const expenseRepository = new ExpensesRepository();
    const result = await expenseRepository.findByDescription("test");

    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
        category: "alimentação",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({
      where: {
        description: "test",
      },
    });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should return an expense by id", async () => {
    mockedGetRepo.findOne.mockResolvedValue({
      id: 2,
      description: "test",
      value: 100,
      date: "10/10/1991",
      category: "outras",
    });

    const expenseRepository = new ExpensesRepository();
    const result = await expenseRepository.findById(2);

    expect(result).toEqual({
      id: 2,
      description: "test",
      value: 100,
      date: "10/10/1991",
      category: "outras",
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledWith({
      where: {
        id: 2,
      },
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
  });

  it("Should update an expense", async () => {
    jest.spyOn(mockedGetRepo, "update");

    const expenseRepository = new ExpensesRepository();
    await expenseRepository.update(
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
        category: "moradia",
      },
      1
    );

    expect(mockedGetRepo.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: "test",
      value: 100,
      date: "10/10/1990",
      category: "moradia",
    });
    expect(mockedGetRepo.update).toHaveBeenCalledTimes(1);
  });

  it("Should delete an expense", async () => {
    jest.spyOn(mockedGetRepo, "delete");

    const expenseRepository = new ExpensesRepository();
    await expenseRepository.delete(1);

    expect(mockedGetRepo.delete).toHaveBeenCalledWith(1);
    expect(mockedGetRepo.delete).toHaveBeenCalledTimes(1);
  });

  it("Should return all expense by description", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
        category: "moradia",
      },
      {
        id: 2,
        description: "test by test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ]);

    const expenseRepository = new ExpensesRepository();
    const result = await expenseRepository.searchByDescription("test");

    expect(result).toEqual([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
        category: "moradia",
      },
      {
        id: 2,
        description: "test by test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({ description: "%test%" });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should return all expense by date", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
        category: "moradia",
      },
    ]);

    const expenseRepository = new ExpensesRepository();
    const result = await expenseRepository.searchByDate("10", "1990");

    expect(result).toEqual([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
        category: "moradia",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({ date: "%10/1990" });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });
});
