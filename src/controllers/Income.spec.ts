import { Request, Response } from "express";
import IncomesController from "./Incomes";
import {
  DeleteIncomes,
  UpdateIncomes,
  FindByIdIncomes,
  FindAllIncomes,
  SaveIncomes,
  SearchByIncomes,
} from "../useCases/Incomes";

jest.mock("../repositories/implementation/IncomesRepository");
jest.mock("../useCases/Incomes");

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

describe("Incomes Controllers", () => {
  let controller: IncomesController;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = {
      body: {},
    } as Request;
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn().mockReturnThis(),
    } as any;
    controller = new IncomesController();
    jest.restoreAllMocks();
  });

  it("Should return status 400 if a date is invalid: SaveIncomes", async () => {
    SaveIncomes.prototype.execute = jest.fn();
    const spySaveIncomes = jest
      .spyOn(SaveIncomes.prototype, "execute")
      .mockRejectedValue(new Error("The date is invalid"));

    const mockRequest = {
      body: {
        description: "test",
        value: 100,
        date: "1/10/1990",
      },
    } as any;

    await controller.saveIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "The date is invalid" });
    expect(spySaveIncomes).toBeCalledTimes(1);
    expect(spySaveIncomes).toBeCalledWith({
      description: "test",
      value: 100,
      date: "1/10/1990",
    });
  });

  it("Should return status 201 and create new income: SaveIncomes", async () => {
    SaveIncomes.prototype.execute = jest.fn();
    const spySaveIncomes = jest
      .spyOn(SaveIncomes.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      body: {
        description: "test",
        value: 100,
        date: "10/10/1990",
      },
    } as any;
    
    await controller.saveIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(201);
    expect(spySaveIncomes).toBeCalledTimes(1);
    expect(spySaveIncomes).toBeCalledWith({
      description: "test",
      value: 100,
      date: "10/10/1990",
    });
  });

  it("Should return status 400 if have an error: findAllIncomes", async () => {
    FindAllIncomes.prototype.execute = jest.fn();
    const spyFindAllIncomes = jest
      .spyOn(FindAllIncomes.prototype, "execute")
      .mockRejectedValue(new Error("Unexpected error."));

    await controller.findAllIncomes(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "Unexpected error." });
    expect(spyFindAllIncomes).toBeCalledTimes(1);
  });

  it("Should return status 200 with all incomes: findAllIncomes", async () => {
    FindAllIncomes.prototype.execute = jest.fn();
    const spyFindAllIncomes = jest
      .spyOn(FindAllIncomes.prototype, "execute")
      .mockResolvedValue([
        { id: 1, description: "test", value: 50, date: "10/10/1990" },
      ]);

    await controller.findAllIncomes(request, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith([
      { id: 1, description: "test", value: 50, date: "10/10/1990" },
    ]);
    expect(spyFindAllIncomes).toBeCalledTimes(1);
  });

  it("Should return status 404 if income is not found: findByIdIncomes", async () => {
    FindByIdIncomes.prototype.execute = jest.fn();
    const spyFindByIdIncomes = jest
      .spyOn(FindByIdIncomes.prototype, "execute")
      .mockRejectedValue({
        code: 404,
        message: "Income is not found",
      });

    const mockRequest = {
      params: { id: 1 },
    } as any;

    await controller.findByIdIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "Income is not found" });
    expect(spyFindByIdIncomes).toBeCalledTimes(1);
    expect(spyFindByIdIncomes).toBeCalledWith(1);
  });

  it("Should return status 200 with a income: findByIdIncomes", async () => {
    FindByIdIncomes.prototype.execute = jest.fn();
    const spyFindByIdIncomes = jest
      .spyOn(FindByIdIncomes.prototype, "execute")
      .mockResolvedValue({
        id: 2,
        description: "test",
        value: 50,
        date: "10/10/1990",
      });

    const mockRequest = {
      params: { id: 2 },
    } as any;

    await controller.findByIdIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith({
      id: 2,
      description: "test",
      value: 50,
      date: "10/10/1990",
    });
    expect(spyFindByIdIncomes).toBeCalledTimes(1);
    expect(spyFindByIdIncomes).toBeCalledWith(2);
  });

  it("Should return status 404 if income is not found: updateIncomes", async () => {
    UpdateIncomes.prototype.execute = jest.fn();
    const spyUpdateIncomes = jest
      .spyOn(UpdateIncomes.prototype, "execute")
      .mockRejectedValue({
        code: 404,
        message: "Income is not found",
      });

    const mockRequest = {
      params: { id: 1 },
      body: {
        description: "test",
        value: 10,
        date: "10/10/1990",
      },
    } as any;

    await controller.updateIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "Income is not found" });
    expect(spyUpdateIncomes).toBeCalledTimes(1);
    expect(spyUpdateIncomes).toBeCalledWith(mockRequest.body, 1);
  });

  it("Should return status 204 if update income: updateIncomes", async () => {
    UpdateIncomes.prototype.execute = jest.fn();
    const spyUpdateIncomes = jest
      .spyOn(UpdateIncomes.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      params: { id: 2 },
      body: {
        description: "test",
        value: 10,
        date: "10/10/1990",
      },
    } as any;

    await controller.updateIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(204);
    expect(spyUpdateIncomes).toBeCalledTimes(1);
    expect(spyUpdateIncomes).toBeCalledWith(mockRequest.body, 2);
  });

  it("Should return status 404 if income is not found: deleteIncomes", async () => {
    DeleteIncomes.prototype.execute = jest.fn();
    const spyDeleteIncomes = jest
      .spyOn(DeleteIncomes.prototype, "execute")
      .mockRejectedValue({
        code: 404,
        message: "Income is not found",
      });

    const mockRequest = {
      params: { id: 1 },
    } as any;

    await controller.deleteIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "Income is not found" });
    expect(spyDeleteIncomes).toBeCalledTimes(1);
    expect(spyDeleteIncomes).toBeCalledWith(1);
  });

  it("Should return status 204 if income is delete: deleteIncomes", async () => {
    DeleteIncomes.prototype.execute = jest.fn();
    const spyDeleteIncomes = jest
      .spyOn(DeleteIncomes.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      params: { id: 1 },
    } as any;

    await controller.deleteIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(204);
    expect(spyDeleteIncomes).toBeCalledTimes(1);
    expect(spyDeleteIncomes).toBeCalledWith(1);
  });

  it("Should return status 400 if have a error: searchByIncomes", async () => {
    SearchByIncomes.prototype.execute = jest.fn();
    const spySearchByIncomes = jest
      .spyOn(SearchByIncomes.prototype, "execute")
      .mockRejectedValue(new Error("Unexpected error."));

    const mockRequest = {
      query: { description: "test" },
    } as any;

    await controller.searchByIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "Unexpected error." });
    expect(spySearchByIncomes).toBeCalledTimes(1);
    expect(spySearchByIncomes).toBeCalledWith(mockRequest.query);
  });

  it("Should return status 200 if have incomes with that date: searchByIncomes", async () => {
    SearchByIncomes.prototype.execute = jest.fn();
    const spySearchByIncomes = jest
      .spyOn(SearchByIncomes.prototype, "execute")
      .mockResolvedValue([
        {
          id: 1,
          description: "testing",
          value: 100,
          date: "10/10/2010",
        },
      ]);

    const mockRequest = {
      query: { month: 10, year: "2010" },
    } as any;

    await controller.searchByIncomes(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith([
      {
        id: 1,
        description: "testing",
        value: 100,
        date: "10/10/2010",
      },
    ]);
    expect(spySearchByIncomes).toBeCalledTimes(1);
    expect(spySearchByIncomes).toBeCalledWith(mockRequest.query);
  });
});
