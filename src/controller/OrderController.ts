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
    // Verifica se algum dos parâmetros de período está presente
    if (req.query.startDate || req.query.endDate) {
      // Se somente um for passado, retorna erro
      if (!req.query.startDate || !req.query.endDate) {
        return res.status(400).json({
          error: "startDate e endDate são obrigatórios"
        });
      }

      const { startDate, endDate } = req.query;
      try {
        const orders = await this.service.searchOrdersByPeriod(String(startDate), String(endDate));
        return res.status(200).json(orders);
      } catch (error: any) {
        console.error('Erro ao buscar ordens por período:', error);
        return res.status(500).json({
          success: false,
          message: error.message || 'Erro ao buscar ordens por período.'
        });
      }
    }

    // Realiza a busca padrão se não houver parâmetros de período
    try {
      const orders = await this.service.searchOrders(req.query);
      return res.status(200).json(orders);
    } catch (error: any) {
      console.error('Erro ao buscar ordens de pagamento:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar ordens de pagamento.'
      });
    }
  }

  async registerSignature(req: Request, res: Response) {
    const { orderId, signerName, token, signatureNumber } = req.body;
    try {
      const signature = await this.service.registerSignature(orderId, signerName, token, signatureNumber);
      res.status(200).json(signature);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchOrdersByPeriod(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate e endDate são obrigatórios" });
    }
    try {
      const orders = await this.service.searchOrdersByPeriod(String(startDate), String(endDate));
      res.status(200).json(orders);
    } catch (error: any) {
      console.error('Erro ao buscar ordens por período:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar ordens por período.'
      });
    }
  }

  async updateOrder(req: Request, res: Response) {
    const orderId: number = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId' });
    }

    try {
      const updatedOrder = await this.service.updateOrder(orderId, req.body);
      res.status(200).json({
        message: 'Ordem de pagamento atualizada com sucesso!',
        order: updatedOrder
      });
    } catch (error: any) {
      console.error('Erro ao atualizar ordem de pagamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar ordem de pagamento.'
      });
    }
  }

  async getUserPermission(req: Request, res: Response) {
    const { signerName, signatureNumber } = req.body;
    const permission = await this.service.checkSignaturePermission(signerName, signatureNumber);
    res.status(200).json(permission);
  }

  async cancelOrder(req: Request, res: Response) {
    const orderId: number = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId' });
    }

    try {
      const canceledOrder = await this.service.cancelOrder(orderId);
      res.status(200).json({
        message: 'Ordem de pagamento cancelada com sucesso!',
        order: canceledOrder
      });
    } catch (error: any) {
      console.error('Erro ao cancelar ordem de pagamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cancelar ordem de pagamento.'
      });
    }
  }
}
