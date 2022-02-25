import UsersRepository from "./UsersRepository";
import { getRepository } from "typeorm";
import { mocked } from "jest-mock";

jest.mock("typeorm", () => {
  return {
    getRepository: jest.fn().mockReturnValue({
      save: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
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
    BeforeInsert: jest.fn(),
  };
});

const mockedGetRepo = mocked(getRepository(<jest.Mock>{}));

beforeEach(() => {
  mockedGetRepo.findOne.mockClear();
  mockedGetRepo.save.mockClear();
  mockedGetRepo.create.mockClear();
});

const dataMock = {
  name: "test",
  email: "test@test.com",
  password: "test123",
};

describe("UsersRepository Repositories", () => {
  it("Should create one copy a user", async () => {
    jest.spyOn(mockedGetRepo, "create").mockResolvedValue(dataMock);

    const userRepository = new UsersRepository();
    const result = await userRepository.create(dataMock);

    expect(result).toEqual(dataMock);
    expect(mockedGetRepo.create).toHaveBeenCalledWith(dataMock);
    expect(mockedGetRepo.create).toHaveBeenCalledTimes(1);
  });

  it("Should create a new user", async () => {
    jest.spyOn(mockedGetRepo, "save");

    const userRepository = new UsersRepository();
    await userRepository.save(dataMock);

    expect(mockedGetRepo.save).toHaveBeenCalledWith(dataMock);
    expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
  });

  it("Should return a user by id", async () => {
    jest
      .spyOn(mockedGetRepo, "findOne")
      .mockResolvedValue({ id: 2, ...dataMock });

    const userRepository = new UsersRepository();
    const result = await userRepository.findById(2);

    expect(result).toEqual({ id: 2, ...dataMock });
    expect(mockedGetRepo.findOne).toHaveBeenCalledWith({
      where: { id: 2 },
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
  });

  it("Should return a user by email", async () => {
    jest
      .spyOn(mockedGetRepo, "findOne")
      .mockResolvedValue({ id: 2, ...dataMock });

    const userRepository = new UsersRepository();
    const result = await userRepository.findByEmail("test@test.com");

    expect(result).toEqual({ id: 2, ...dataMock });
    expect(mockedGetRepo.findOne).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
    });
    expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
  });
});
