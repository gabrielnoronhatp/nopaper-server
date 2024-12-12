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
      res.status(201).json({ 
        message: 'Ordem de pagamento cadastrada com sucesso!', 
        id: order.id 
      });
    } catch (error: any) {
      console.error('Erro ao cadastrar ordem:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erro ao cadastrar ordem de pagamento.' 
      });
    }
  }
}