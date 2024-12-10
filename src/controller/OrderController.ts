import { Request, Response } from 'express';
import OrderService from '../service/OrderService';

export default class OrderController {
  private service: OrderService;

  constructor(service: OrderService) {
    this.service = service;
  }

  async createOrder(req: Request, res: Response) {
    try {
      const order = await this.service.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ordem.' });
    }
  }
}
