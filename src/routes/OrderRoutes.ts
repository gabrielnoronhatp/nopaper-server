import { Router } from 'express';
import OrderController from '../controller/OrderController';
import OrderService from '../service/OrderService';
import Order from '../models/Order';
import { pgPool } from '../config/database';

const router = Router();
const orderModel = new Order(pgPool);
const orderService = new OrderService(orderModel, pgPool);
const orderController = new OrderController(orderService, pgPool);

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
 *               dtavistaOP:
 *                 type: string
 *               bancoOP:
 *                 type: string
 *               agenciaOP:
 *                 type: string
 *               contaOP:
 *                 type: string
 *               dtdepositoOP:
 *                 type: string
 *               parcelasOP:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     parcela:
 *                       type: string
 *               produtosOP:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     valor:
 *                       type: number
 *                     centroCusto:
 *                       type: string
 *               observacaoOP:
 *                 type: string
 *               tipopixOP:
 *                 type: string
 *               chavepixOP:
 *                 type: string
 *               datapixOP:
 *                 type: string
 *               opcaoLancOP:
 *                 type: string
 *               ccustoOP:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     centrocusto:
 *                       type: string
 *                     valor:
 *                       type: number
 *               userOP:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 *       500:
 *         description: Erro ao criar ordem
 */
router.post('/cadastrar-ordem', (req, res) => orderController.createOrder(req, res));

/**
 * @swagger
 * /api/consultar-ordem:
 *   get:
 *     summary: Retorna uma lista de todas as ordens de pagamento
 *     responses:
 *       200:
 *         description: Lista de ordens de pagamento
 *       500:
 *         description: Erro ao buscar ordens de pagamento
 */
router.get('/consultar-ordem', (req, res) => orderController.getOrders(req, res));

/**
 * @swagger
 * /api/testar-conexao:
 *   get:
 *     summary: Testa a conexão com o banco de dados
 *     responses:
 *       200:
 *         description: Conexão bem-sucedida
 *       500:
 *         description: Erro ao testar a conexão
 */
router.get('/testar-conexao', async (req, res) => {
  const isConnected = await orderController.testConnection();
  if (isConnected) {
    res.status(200).json({ message: 'Conexão bem-sucedida!' });
  } else {
    res.status(500).json({ message: 'Erro ao testar a conexão.' });
  }
});

/**
 * @swagger
 * /api/dadoscontager:
 *   get:
 *     summary: Retorna todas as contas gerenciais
 *     responses:
 *       200:
 *         description: Lista de contas gerenciais
 *       500:
 *         description: Erro ao buscar dados conta gerencial
 */
router.get('/dadoscontager', (req, res) => orderController.getContasGerenciais(req, res));

/**
 * @swagger
 * /api/contagerwint:
 *   get:
 *     summary: Busca contas gerenciais com base em uma query
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para contas gerenciais
 *     responses:
 *       200:
 *         description: Lista de contas gerenciais filtradas
 *       500:
 *         description: Erro ao buscar conta gerencial
 */
router.get('/contagerwint', (req, res) => orderController.searchContasGerenciais(req, res));

/**
 * @swagger
 * /api/dadosccusto:
 *   get:
 *     summary: Retorna todos os centros de custo
 *     responses:
 *       200:
 *         description: Lista de centros de custo
 *       500:
 *         description: Erro ao buscar dados centro de custo
 */
router.get('/dadosccusto', (req, res) => orderController.getCentrosCusto(req, res));

/**
 * @swagger
 * /api/ccustowint:
 *   get:
 *     summary: Busca centros de custo com base em uma query
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para centros de custo
 *     responses:
 *       200:
 *         description: Lista de centros de custo filtrados
 *       500:
 *         description: Erro ao buscar centro de custo
 */
router.get('/ccustowint', (req, res) => orderController.searchCentrosCusto(req, res));

export default router;