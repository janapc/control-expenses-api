import { Request, Response } from "express";
import ExpensesController from "./Expenses";
import {
  FindAllExpenses,
  SaveExpenses,
  FindByIdExpenses,
  UpdateExpenses,
  DeleteExpenses,
  SearchByExpenses,
} from "../useCases/Expenses";

jest.mock("../repositories/implementation/ExpensesRepository");
jest.mock("../useCases/Expenses");

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

describe("Expenses Controllers", () => {
  let controller: ExpensesController;
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
    controller = new ExpensesController();
    jest.restoreAllMocks();
  });

  it("Should return status 400 if have an error: findAllExpenses", async () => {
    FindAllExpenses.prototype.execute = jest.fn();
    const spyFindAllExpenses = jest
      .spyOn(FindAllExpenses.prototype, "execute")
      .mockRejectedValue(new Error("Expenses is not found"));

    await controller.findAllExpenses(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "Expenses is not found" });
    expect(spyFindAllExpenses).toBeCalledTimes(1);
  });

  it("Should return status 200 with all expenses: findAllExpenses", async () => {
    FindAllExpenses.prototype.execute = jest.fn();
    const spyFindAllExpenses = jest
      .spyOn(FindAllExpenses.prototype, "execute")
      .mockResolvedValue([
        {
          id: 1,
          description: "test",
          value: 90,
          date: "10/10/1991",
          category: "outras",
        },
      ]);

    await controller.findAllExpenses(request, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith([
      {
        id: 1,
        description: "test",
        value: 90,
        date: "10/10/1991",
        category: "outras",
      },
    ]);
    expect(spyFindAllExpenses).toBeCalledTimes(1);
  });

  it("Should return status 400 if date is invalid: saveExpenses", async () => {
    SaveExpenses.prototype.execute = jest.fn();

    const spySaveExpenses = jest
      .spyOn(SaveExpenses.prototype, "execute")
      .mockRejectedValue(new Error("The date is invalid"));

    const mockRequest = {
      body: {
        description: "test",
        value: 50,
        date: "1/10/1990",
        category: "outras",
      },
    } as Request;

    await controller.saveExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "The date is invalid" });
    expect(spySaveExpenses).toBeCalledTimes(1);
    expect(spySaveExpenses).toBeCalledWith(mockRequest.body);
  });

  it("Should return status 201 if create new Expense: saveExpenses", async () => {
    SaveExpenses.prototype.execute = jest.fn();

    const spySaveExpenses = jest
      .spyOn(SaveExpenses.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      body: {
        description: "test",
        value: 50,
        date: "1/10/1990",
        category: "outras",
      },
    } as Request;

    await controller.saveExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(201);
    expect(spySaveExpenses).toBeCalledTimes(1);
    expect(spySaveExpenses).toBeCalledWith(mockRequest.body);
  });

  it("Should return status 404 if not find expense: findByIdExpenses", async () => {
    FindByIdExpenses.prototype.execute = jest.fn();

    const spyFindByIdExpenses = jest
      .spyOn(FindByIdExpenses.prototype, "execute")
      .mockRejectedValue({ code: 404, message: "Expense is not found" });

    const mockRequest = {
      params: {
        id: "1",
      },
    } as any;

    await controller.findByIdExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "Expense is not found" });
    expect(spyFindByIdExpenses).toBeCalledTimes(1);
    expect(spyFindByIdExpenses).toBeCalledWith(1);
  });

  it("Should return status 200 with an expense: findByIdExpenses", async () => {
    FindByIdExpenses.prototype.execute = jest.fn();

    const spyFindByIdExpenses = jest
      .spyOn(FindByIdExpenses.prototype, "execute")
      .mockResolvedValue({
        id: 2,
        description: "test",
        value: 40,
        date: "10/10/1990",
        category: "outras",
      });

    const mockRequest = {
      params: {
        id: "2",
      },
    } as any;

    await controller.findByIdExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith({
      id: 2,
      description: "test",
      value: 40,
      date: "10/10/1990",
      category: "outras",
    });
    expect(spyFindByIdExpenses).toBeCalledTimes(1);
    expect(spyFindByIdExpenses).toBeCalledWith(2);
  });

  it("Should return status 400 if date is invalid: updateExpenses", async () => {
    UpdateExpenses.prototype.execute = jest.fn();

    const spyUpdateExpenses = jest
      .spyOn(UpdateExpenses.prototype, "execute")
      .mockRejectedValue(new Error("The date is invalid"));

    const mockRequest = {
      params: {
        id: 2,
      },
      body: {
        description: "testing",
        value: 44,
        date: "1/10/1990",
        category: "outras",
      },
    } as any;

    await controller.updateExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "The date is invalid" });
    expect(spyUpdateExpenses).toBeCalledTimes(1);
    expect(spyUpdateExpenses).toBeCalledWith(
      mockRequest.body,
      mockRequest.params.id
    );
  });

  it("Should return status 204 and update expense: updateExpenses", async () => {
    UpdateExpenses.prototype.execute = jest.fn();

    const spyUpdateExpenses = jest
      .spyOn(UpdateExpenses.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      params: {
        id: 2,
      },
      body: {
        description: "testing",
        value: 44,
        date: "10/10/1990",
        category: "outras",
      },
    } as any;

    await controller.updateExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(204);
    expect(spyUpdateExpenses).toBeCalledTimes(1);
    expect(spyUpdateExpenses).toBeCalledWith(
      mockRequest.body,
      mockRequest.params.id
    );
  });

  it("Should return status 404 if not found expense: deleteExpenses", async () => {
    DeleteExpenses.prototype.execute = jest.fn();

    const spyDeleteExpenses = jest
      .spyOn(DeleteExpenses.prototype, "execute")
      .mockRejectedValue({
        code: 404,
        message: "Expense is not found",
      });

    const mockRequest = {
      params: {
        id: 2,
      },
    } as any;

    await controller.deleteExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: "Expense is not found" });
    expect(spyDeleteExpenses).toBeCalledTimes(1);
    expect(spyDeleteExpenses).toBeCalledWith(2);
  });

  it("Should return status 204 if the expense is delete: deleteExpenses", async () => {
    DeleteExpenses.prototype.execute = jest.fn();

    const spyDeleteExpenses = jest
      .spyOn(DeleteExpenses.prototype, "execute")
      .mockResolvedValue();

    const mockRequest = {
      params: {
        id: 1,
      },
    } as any;

    await controller.deleteExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(204);
    expect(spyDeleteExpenses).toBeCalledTimes(1);
    expect(spyDeleteExpenses).toBeCalledWith(1);
  });

  it("Should return status 400 if have a error: searchByExpenses", async () => {
    SearchByExpenses.prototype.execute = jest.fn();

    const spySearchByExpenses = jest
      .spyOn(SearchByExpenses.prototype, "execute")
      .mockRejectedValue(new Error("Unexpected error."));

    const mockRequest = {
      query: {
        month: "10",
        year: "1990",
      },
    } as any;

    await controller.searchByExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: "Unexpected error." });
    expect(spySearchByExpenses).toBeCalledTimes(1);
    expect(spySearchByExpenses).toBeCalledWith(mockRequest.query);
  });

  it("Should return status 200 if have expenses with that description: searchByExpenses", async () => {
    SearchByExpenses.prototype.execute = jest.fn();

    const spySearchByExpenses = jest
      .spyOn(SearchByExpenses.prototype, "execute")
      .mockResolvedValue([
        {
          id: 12,
          description: "banana",
          value: 20,
          date: "10/11/1990",
          category: "outras",
        },
      ]);

    const mockRequest = {
      query: {
        description: "banana",
      },
    } as any;

    await controller.searchByExpenses(mockRequest, response);

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith([
      {
        id: 12,
        description: "banana",
        value: 20,
        date: "10/11/1990",
        category: "outras",
      },
    ]);
    expect(spySearchByExpenses).toBeCalledTimes(1);
    expect(spySearchByExpenses).toBeCalledWith(mockRequest.query);
  });
});
