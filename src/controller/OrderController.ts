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

  async getOrderById(req: Request, res: Response) {
    const opId: string = req.params.id;
    try {
      const order = await this.service.getOrderById(parseInt(opId));
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Ordem de pagamento com ID ${opId} não encontrada.`,
        });
      }
  
      res.status(200).json(order);
    } catch (error: any) {
      console.error('Erro ao buscar ordem de pagamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar ordem de pagamento.',
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

  async getItensContratados(req: Request, res: Response): Promise<void> {
    try {
      const itens = await this.service.getItensContratados();
      res.json(itens);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCentrosCustoRateio(req: Request, res: Response): Promise<void> {
    try {
      const centrosCusto = await this.service.getCentrosCustoRateio();
      res.json(centrosCusto);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFormasPagamento(req: Request, res: Response): Promise<void> {
    try {
      const formasPagamento = await this.service.getFormasPagamento();
      res.json(formasPagamento);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderDetails(req: Request, res: Response) {
    const ordemId: number = parseInt(req.params.ordemId, 10);
    if (isNaN(ordemId)) {
      return res.status(400).json({ error: 'Invalid ordemId' });
    }

    try {
      const orderDetails = await this.service.getOrderDetailsById(ordemId);
      res.json(orderDetails);
    } catch (error: any) {
      console.error('Erro ao buscar detalhes da ordem:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async searchOrders(req: Request, res: Response) {
    try {
      const orders = await this.service.searchOrders(req.query);
      res.status(200).json(orders);
    } catch (error: any) {
      console.error('Erro ao buscar ordens de pagamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar ordens de pagamento.',
      });
    }
  }
}
