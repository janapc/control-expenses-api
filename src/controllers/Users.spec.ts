import { Request, Response } from "express";
import UsersController from "./Users";
import { SaveUsers, FindByIdUsers, AccessTokenUsers } from "../useCases/Users";

jest.mock("../repositories/implementation/UsersRepository");
jest.mock("../useCases/Users");

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
    BeforeInsert: jest.fn(),
  };
});

describe("Users Controllers", () => {
  let controller: UsersController;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = {
      body: {},
    } as Request;
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
    jest.restoreAllMocks();
    controller = new UsersController();
  });

  it("Should return status 400 if email is invalid: saveUsers", async () => {
    SaveUsers.prototype.execute = jest.fn();
    const spySaveUsers = jest
      .spyOn(SaveUsers.prototype, "execute")
      .mockRejectedValue(new Error("The Email is invalid"));

    const mockRequest = {
      body: {
        name: "test",
        email: "test.com",
        password: "1234",
      },
    } as any;

    await controller.saveUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "The Email is invalid" });
    expect(spySaveUsers).toBeCalledTimes(1);
    expect(spySaveUsers).toBeCalledWith(mockRequest.body);
  });

  it("Should return status 201 if create new user: saveUsers", async () => {
    SaveUsers.prototype.execute = jest.fn();
    const spySaveUsers = jest
      .spyOn(SaveUsers.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      body: { name: "test", email: "test@test.com", password: "1234" },
    } as any;

    await controller.saveUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(201);
    expect(spySaveUsers).toBeCalledTimes(1);
    expect(spySaveUsers).toBeCalledWith(mockRequest.body);
  });

  it("Should return status 404 if user is not found: findByIdUsers", async () => {
    FindByIdUsers.prototype.execute = jest.fn();
    const spyFindByIdUsers = jest
      .spyOn(FindByIdUsers.prototype, "execute")
      .mockRejectedValue({ code: 404, message: "The user is not found" });

    const mockRequest = {
      params: {
        id: 1,
      },
    } as any;

    await controller.findByIdUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "The user is not found" });
    expect(spyFindByIdUsers).toBeCalledTimes(1);
    expect(spyFindByIdUsers).toBeCalledWith(1);
  });

  it("Should return status 200 with a user: findByIdUsers", async () => {
    FindByIdUsers.prototype.execute = jest.fn();
    const spyFindByIdUsers = jest
      .spyOn(FindByIdUsers.prototype, "execute")
      .mockResolvedValue({
        id: 2,
        name: "test",
        email: "test@test.com",
      });

    const mockRequest = {
      params: {
        id: 2,
      },
    } as any;

    await controller.findByIdUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith({
      id: 2,
      name: "test",
      email: "test@test.com",
    });
    expect(spyFindByIdUsers).toBeCalledTimes(1);
    expect(spyFindByIdUsers).toBeCalledWith(2);
  });

  it("Should return status 404 if user is not found: accessTokenUsers", async () => {
    AccessTokenUsers.prototype.execute = jest.fn();
    const spyAccessTokenUsers = jest
      .spyOn(AccessTokenUsers.prototype, "execute")
      .mockRejectedValue({ code: 404, message: "The user is not found" });

    const mockRequest = {
      body: {
        email: "test@test.com",
        password: "1234",
      },
    } as any;

    await controller.accessTokenUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "The user is not found" });
    expect(spyAccessTokenUsers).toBeCalledTimes(1);
    expect(spyAccessTokenUsers).toBeCalledWith("test@test.com", "1234");
  });

  it("Should return status 200 with accessToken: accessTokenUsers", async () => {
    AccessTokenUsers.prototype.execute = jest.fn();
    const spyAccessTokenUsers = jest
      .spyOn(AccessTokenUsers.prototype, "execute")
      .mockResolvedValue(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.fhc3wykrAnRpcKApKhXiahxaOe8PSHatad31NuIZ0Zg"
      );

    const mockRequest = {
      body: {
        email: "test@test.com",
        password: "1234",
      },
    } as any;

    await controller.accessTokenUsers(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith({
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.fhc3wykrAnRpcKApKhXiahxaOe8PSHatad31NuIZ0Zg",
    });
    expect(spyAccessTokenUsers).toBeCalledTimes(1);
    expect(spyAccessTokenUsers).toBeCalledWith("test@test.com", "1234");
  });
});
