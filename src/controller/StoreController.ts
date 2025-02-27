import { Request, Response } from 'express';
import { StoreService } from '../service/StoreService';

export class StoreController {
  static async getAllStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await StoreService.getAllStores(req.query.q as string);
      res.json(stores);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async searchStores(req: Request, res: Response): Promise<void> {
    const searchQuery = req.query.q as string;
    const ramo = req.query.ramo as string;
    try {
      const stores = await StoreService.searchStores(searchQuery, ramo);
      res.json(stores);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
} 