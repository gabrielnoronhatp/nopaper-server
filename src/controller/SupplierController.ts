import { Request, Response } from 'express';
import { SupplierService } from '../service/SupplierService';

export class SupplierController {
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    const searchQuery = req.query.q as string;
    try {
      const suppliers = await SupplierService.getSuppliers(searchQuery);
      res.json(suppliers);
    } catch (error:any) {
      res.status(500).send(error.message);
    }
  }
} 