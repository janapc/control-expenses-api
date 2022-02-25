import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import verifyToken from "./verifyToken";
import { FindByIdUsers } from "../useCases/Users";

jest.mock("../repositories/implementation/UsersRepository");
jest.mock("../useCases/Users");
jest.mock("jsonwebtoken");

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

describe("VerifyToken Middleware", () => {
  let request: Request;
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    request = {
      body: {},
    } as any;
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
    next = jest.fn();
    jest.restoreAllMocks();
  });

  it("Should return error if not have the authorization field", async () => {
    const result = await verifyToken(request, response, next);

    expect(result.status).toBeCalledWith(400);
    expect(result.json).toBeCalledWith({
      message: "The authorization parameter is mandatory",
    });
  });

  it("Should return error if the token is invalid", async () => {
    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw new Error("jwt invalid");
    });

    const mockRequest = {
      headers: {
        authorization: "Bearer 123",
      },
    } as any;

    const result = await verifyToken(mockRequest, response, next);

    expect(result.status).toBeCalledWith(400);
    expect(result.json).toBeCalledWith({
      message: "jwt invalid",
    });
  });

  it("Should return error if the user is not found", async () => {
    FindByIdUsers.prototype.execute = jest.fn();
    const spyFindByIdUsers = jest
      .spyOn(FindByIdUsers.prototype, "execute")
      .mockRejectedValue({ code: 404, message: "The user is not found" });

    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      return { id: 1 };
    });

    const mockRequest = {
      headers: {
        authorization: "Bearer 123",
      },
    } as any;

    const result = await verifyToken(mockRequest, response, next);

    expect(result.status).toBeCalledWith(404);
    expect(result.json).toBeCalledWith({
      message: "The user is not found",
    });
    expect(spyFindByIdUsers).toBeCalledTimes(1)
    expect(spyFindByIdUsers).toBeCalledWith(1)
  });

  it("Should valid the token", async () => {
    FindByIdUsers.prototype.execute = jest.fn();
    const spyFindByIdUsers = jest
      .spyOn(FindByIdUsers.prototype, "execute")
      .mockResolvedValue({
        id: 2,
        name: "test",
        email: "test@test.com",
      });

    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      return { id: 1 };
    });

    const mockRequest = {
      headers: {
        authorization: "Bearer 123",
      },
    } as any;

    await verifyToken(mockRequest, response, next);

    expect(next).toBeCalledTimes(1);
    expect(spyFindByIdUsers).toBeCalledTimes(1)
    expect(spyFindByIdUsers).toBeCalledWith(1)
  });
});
