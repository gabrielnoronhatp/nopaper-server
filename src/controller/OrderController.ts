import { Request, Response } from 'express';
import OrderService from '../service/OrderService';
import { Pool } from 'pg';

export default class OrderController {
  private service: OrderService;
  private pool: Pool;

  constructor(service: OrderService, pool: Pool) {
    this.service = service;
    this.pool = pool;
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



    async getOrders(req: Request, res: Response) {
      try {
        const orders = await this.service.getAllOrders();
        res.status(200).json(orders);
      } catch (error: any) {
        console.error('Erro ao buscar ordens de pagamento:', error);
        res.status(500).json({ 
          success: false, 
          message: error.message || 'Erro ao buscar ordens de pagamento.' 
        });
      }
    }

  async getContasGerenciais(req: Request, res: Response) {
    try {
      const contas = await this.service.getContasGerenciais();
      res.status(200).json(contas);
    } catch (error: any) {
      console.error('Erro ao buscar dados conta gerencial:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erro ao buscar dados conta gerencial.' 
      });
    }
  }

  async searchContasGerenciais(req: Request, res: Response) {
    const searchQuery = req.query.q as string;
    try {
      const contas = await this.service.searchContasGerenciais(searchQuery);
      res.status(200).json(contas);
    } catch (error: any) {
      console.error('Erro ao buscar conta gerencial:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erro ao buscar conta gerencial.' 
      });
    }
  }

  async getCentrosCusto(req: Request, res: Response) {
    try {
      const centros = await this.service.getCentrosCusto();
      res.status(200).json(centros);
    } catch (error: any) {
      console.error('Erro ao buscar dados centro de custo:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erro ao buscar dados centro de custo.' 
      });
    }
  }

  async searchCentrosCusto(req: Request, res: Response) {
    const searchQuery = req.query.q as string;
    try {
      const centros = await this.service.searchCentrosCusto(searchQuery);
      res.status(200).json(centros);
    } catch (error: any) {
      console.error('Erro ao buscar centro de custo:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erro ao buscar centro de custo.' 
      });
    }
  }
}
