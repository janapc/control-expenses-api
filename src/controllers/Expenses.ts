import { Request, Response } from "express";

import DomainExpenses from "../domain/Expenses";
import Expenses from "../repositories/interfaces/Expenses";
import ExpensesRepository from "../repositories/implementation/ExpensesRepository";

import {
  DeleteExpenses,
  FindAllExpenses,
  SaveExpenses,
  FindByIdExpenses,
  UpdateExpenses,
  SearchByExpenses,
} from "../useCases/Expenses";
import  { Query } from "../useCases/Expenses/SearchByExpenses";

export default class ExpensesController {
  private expensesRepository: Expenses;

  constructor() {
    this.expensesRepository = new ExpensesRepository();
  }

  findAllExpenses = async (req: Request, res: Response) => {
    try {
      const findAllExpensesCase = new FindAllExpenses(this.expensesRepository);
      const result = await findAllExpensesCase.execute();

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  saveExpenses = async (req: Request, res: Response) => {
    try {
      const { id, ...data } = req.body as DomainExpenses;

      const saveExpensesCase = new SaveExpenses(this.expensesRepository);
      await saveExpensesCase.execute(data);

      return res.status(201).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  findByIdExpenses = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const findByIdExpensesCase = new FindByIdExpenses(
        this.expensesRepository
      );
      const result = await findByIdExpensesCase.execute(Number(id));

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  updateExpenses = async (req: Request, res: Response) => {
    try {
      const expensesId = req.params.id;
      const { id, ...data } = req.body as DomainExpenses;

      const updateExpensesCase = new UpdateExpenses(this.expensesRepository);
      await updateExpensesCase.execute(data, Number(expensesId));

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  deleteExpenses = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleteExpensesCase = new DeleteExpenses(this.expensesRepository);
      await deleteExpensesCase.execute(Number(id));

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  searchByExpenses = async (req: Request, res: Response) => {
    try {
      const query = req.query as Query;
      const searchByExpensesCase = new SearchByExpenses(
        this.expensesRepository
      );
      const result = await searchByExpensesCase.execute(query);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };
}
