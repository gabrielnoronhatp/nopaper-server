import { Router } from 'express';
import OrderController from '../controller/OrderController';
import OrderService from '../service/OrderService';
import Order from '../models/Order';
import { pgPool } from '../config/database';

const router = Router();
const orderModel = new Order(pgPool);
const orderService = new OrderService(orderModel);
const orderController = new OrderController(orderService);

/**
 * @swagger
 * /api/cadastrar-ordem:
 *   post:
 *     summary: Cria uma nova ordem de pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dtlanc:
 *                 type: string
 *               ramoOP:
 *                 type: string
 *               notaOP:
 *                 type: string
 *               qtparcelasOP:
 *                 type: number
 *               contagerencialOP:
 *                 type: string
 *               fornecedorOP:
 *                 type: string
 *               lojaOP:
 *                 type: string
 *               serieOP:
 *                 type: string
 *               metodoOP:
 *                 type: string
 *               qtitensOP:
 *                 type: number
 *               valorimpostoOP:
 *                 type: number
 *               produtosOP:
 *                 type: array
 *               ccustoOP:
 *                 type: array
 *               observacaoOP:
 *                 type: string
 *               opcaoLancOP:
 *                 type: string
 *               userOP:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 *       500:
 *         description: Erro ao criar ordem
 */
router.post('/cadastrar-ordem', (req, res) => orderController.createOrder(req, res));

export default router;