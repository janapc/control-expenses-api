import { Request, Response } from "express";

import DomainIncomes from "../domain/Incomes";
import Incomes from "../repositories/interfaces/Incomes";
import IncomesRepository from "../repositories/implementation/IncomesRepository";

import {
  DeleteIncomes,
  UpdateIncomes,
  FindByIdIncomes,
  FindAllIncomes,
  SaveIncomes,
  SearchByIncomes,
} from "../useCases/Incomes";
import { Query } from "../useCases/Incomes/SearchByIncomes";

export default class IncomesController {
  private incomesRepository: Incomes;

  constructor() {
    this.incomesRepository = new IncomesRepository();
  }

  saveIncomes = async (req: Request, res: Response) => {
    try {
      const { id, ...data } = req.body as DomainIncomes;

      const saveIncomesCase = new SaveIncomes(this.incomesRepository);
      await saveIncomesCase.execute(data);

      return res.status(201).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  findAllIncomes = async (req: Request, res: Response) => {
    try {
      const findAllIncomesCase = new FindAllIncomes(this.incomesRepository);
      const result = await findAllIncomesCase.execute();

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  findByIdIncomes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const findByIdIncomesCase = new FindByIdIncomes(this.incomesRepository);
      const result = await findByIdIncomesCase.execute(Number(id));

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  updateIncomes = async (req: Request, res: Response) => {
    try {
      const incomesId = req.params.id;
      const { id, ...data } = req.body as DomainIncomes;

      const updateIncomesCase = new UpdateIncomes(this.incomesRepository);
      await updateIncomesCase.execute(data, Number(incomesId));

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  deleteIncomes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleteIncomesCase = new DeleteIncomes(this.incomesRepository);
      await deleteIncomesCase.execute(Number(id));

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };

  searchByIncomes = async (req: Request, res: Response) => {
    try {
      const query = req.query as Query;
      const searchByIncomesCase = new SearchByIncomes(this.incomesRepository);
      const result = await searchByIncomesCase.execute(query);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.code || 400).json({
        message: error.message || "Unexpected error.",
      });
    }
  };
}
