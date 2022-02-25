import IncomesRepository from "./IncomesRepository";
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

describe("IncomesRepository Repositories", () => {
  it("Should save an income", async () => {
    jest.spyOn(mockedGetRepo, "save");

    const incomeRepository = new IncomesRepository();
    await incomeRepository.save({
      description: "test",
      value: 100,
      date: "10/10/1990",
    });

    expect(mockedGetRepo.save).toHaveBeenCalledWith({
      description: "test",
      value: 100,
      date: "10/10/1990",
    });
    expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
  });

  it("Should return all income with description equal", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    ]);

    const incomeRepository = new IncomesRepository();
    const result = await incomeRepository.findByDescription("test");

    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({
      where: { description: "test" },
    });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should return all income", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    ]);

    const incomeRepository = new IncomesRepository();
    const result = await incomeRepository.findAll();

    expect(result).toEqual([
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith(undefined);
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should return an income by id", async () => {
    mockedGetRepo.findOne.mockResolvedValue({
      id: 1,
      description: "test",
      value: 100,
      date: "10/10/1990",
    });

    const incomeRepository = new IncomesRepository();
    const result = await incomeRepository.findById(1);

    expect(result).toEqual({
      id: 1,
      description: "test",
      value: 100,
      date: "10/10/1990",
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
  });

  it("Should update an income", async () => {
    jest.spyOn(mockedGetRepo, "update");

    const incomeRepository = new IncomesRepository();
    await incomeRepository.update(
      {
        id: 1,
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
      1
    );
    expect(mockedGetRepo.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: "test",
      value: 100,
      date: "10/10/1990",
    });
    expect(mockedGetRepo.update).toHaveBeenCalledTimes(1);
  });

  it("Should delete an income", async () => {
    jest.spyOn(mockedGetRepo, "delete");

    const incomeRepository = new IncomesRepository();
    await incomeRepository.delete(1);
    expect(mockedGetRepo.delete).toHaveBeenCalledWith(1);
    expect(mockedGetRepo.delete).toHaveBeenCalledTimes(1);
  });

  it("Should return all income by description", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    const incomeRepository = new IncomesRepository();
    const result = await incomeRepository.searchByDescription("test");

    expect(result).toEqual([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({ description: "%test%" });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });

  it("Should return all income by date", async () => {
    mockedGetRepo.find.mockResolvedValue([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    const incomeRepository = new IncomesRepository();
    const result = await incomeRepository.searchByDate("10", "1990");

    expect(result).toEqual([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/1990",
      },
    ]);
    expect(mockedGetRepo.find).toHaveBeenCalledWith({ date: "%10/1990" });
    expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
  });
});
