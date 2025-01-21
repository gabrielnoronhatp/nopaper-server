import { Router } from 'express';
import OrderController from '../controller/OrderController';
import OrderService from '../service/OrderService';
import Order from '../models/Order';
import { pgPool } from '../config/database';
import s3Client from '../awsConfig';
import { ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';

const router = Router();
const orderModel = new Order(pgPool);
const orderService = new OrderService(orderModel, pgPool);
const orderController = new OrderController(orderService, pgPool);
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/cadastrar-ordem:
 *   post:
 *     tags:
 *       - Orders
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
 *     tags:
 *       - Orders
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
 * /api/dadoscontager:
 *   get:
 *     tags:
 *       - Gerencial Accounts
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
 *     tags:
 *       - Gerencial Accounts
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
 *     tags:
 *       - Cost Center
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
 *     tags:
 *       - Cost Center
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

/**
 * @swagger
 * /api/upload/{opId}:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Faz o upload de arquivos para uma ordem de pagamento
 *     parameters:
 *       - in: path
 *         name: opId
 *         required: true
 *         description: ID da ordem de pagamento
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload concluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 opId:
 *                   type: string
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Erro de validação (ID não fornecido ou nenhum arquivo enviado)
 *       404:
 *         description: Ordem de pagamento não encontrada
 *       500:
 *         description: Erro ao fazer upload
 */
router.post('/upload/:opId', upload.array('files', 10), async (req: any, res: any) => {
    try {
      const { opId } = req.params; // ID da OP recebido na rota
      if (!opId) {
        return res.status(400).json({ message: 'ID da OP não fornecido.' });
      }
  
      // Valida a existência da OP
      const order = await orderService.getOrderById(Number(opId));
      if (!order) {
        return res.status(404).json({ message: `Ordem de Pagamento com ID ${opId} não encontrada.` });
      }
  
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }
  
      const uploadPromises = req.files.map(async (file: any) => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${opId}/${Date.now()}-${file.originalname}`, // Organiza os arquivos na pasta da OP
          Body: file.buffer,
          ContentType: file.mimetype,
        };
  
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
  
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      });
  
      const fileUrls = await Promise.all(uploadPromises);
  
      res.status(200).json({
        message: 'Upload concluído.',
        opId,
        urls: fileUrls, // Retorna as URLs dos arquivos para referência
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ message: 'Erro no upload.', error });
    }
  });

/**
 * @swagger
 * /api/arquivos/{opId}:
 *   get:
 *     tags:
 *       - Upload
 *     summary: Retorna os arquivos associados a uma ordem de pagamento
 *     parameters:
 *       - in: path
 *         name: opId
 *         required: true
 *         description: ID da ordem de pagamento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de URLs dos arquivos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 opId:
 *                   type: string
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Nenhum arquivo encontrado para a ordem de pagamento
 *       500:
 *         description: Erro ao buscar arquivos
 */

router.get('/arquivos/:opId', async (req: any, res: any) => {
    const { opId } = req.params;
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: `${opId}/`, // Filtra os arquivos pela pasta da OP
      };
  
      const data = await s3Client.send(new ListObjectsCommand(params));
      const urls = data.Contents?.map((file: any) =>
        `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
      ) || [];
  
      if (urls.length === 0) {
        return res.status(404).json({ message: `Nenhum arquivo encontrado para a OP ${opId}.` });
      }
  
      res.status(200).json({ opId, urls });
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      res.status(500).json({ message: 'Erro ao buscar arquivos.', error });
    }
  });

/**
 * @swagger
 * /api/itens-contratados:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retorna uma lista de todos os itens contratados
 *     responses:
 *       200:
 *         description: Lista de itens contratados
 *       500:
 *         description: Erro ao buscar itens contratados
 */
router.get('/itens-contratados', (req, res) => orderController.getItensContratados(req, res));

/**
 * @swagger
 * /api/centros-custo-rateio:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retorna uma lista de todos os centros de custo para rateio
 *     responses:
 *       200:
 *         description: Lista de centros de custo para rateio
 *       500:
 *         description: Erro ao buscar centros de custo para rateio
 */
router.get('/centros-custo-rateio', (req, res) => orderController.getCentrosCustoRateio(req, res));

/**
 * @swagger
 * /api/formas-pagamento:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retorna uma lista de todas as formas de pagamento
 *     responses:
 *       200:
 *         description: Lista de formas de pagamento
 *       500:
 *         description: Erro ao buscar formas de pagamento
 */
router.get('/formas-pagamento', (req, res) => orderController.getFormasPagamento(req, res));

/**
 * @swagger
 * /api/ordem-detalhes/{ordemId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retorna os detalhes de uma ordem de pagamento específica
 *     parameters:
 *       - in: path
 *         name: ordemId
 *         required: true
 *         description: ID da ordem de pagamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da ordem de pagamento
 *       400:
 *         description: ID da ordem inválido
 *       500:
 *         description: Erro ao buscar detalhes da ordem
 */
router.get('/ordem-detalhes/:ordemId', (req: any, res: any) => {
  orderController.getOrderDetails(req, res);
});

/**
 * @swagger
 * /api/buscar-ordem:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Busca ordens de pagamento com base em múltiplos parâmetros
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID da ordem de pagamento
 *       - in: query
 *         name: numero_nota
 *         schema:
 *           type: string
 *         description: Número da nota
 *       - in: query
 *         name: conta_gerencial
 *         schema:
 *           type: string
 *         description: Conta gerencial
 *       - in: query
 *         name: fornecedor
 *         schema:
 *           type: string
 *         description: Fornecedor
 *       - in: query
 *         name: filial
 *         schema:
 *           type: string
 *         description: Filial
 *       - in: query
 *         name: serienf
 *         schema:
 *           type: string
 *         description: Série NF
 *       - in: query
 *         name: metodo
 *         schema:
 *           type: string
 *         description: Método
 *       - in: query
 *         name: quantidade_itens
 *         schema:
 *           type: string
 *         description: Quantidade de itens
 *       - in: query
 *         name: dtlanc
 *         schema:
 *           type: string
 *         description: Data de lançamento
 *     responses:
 *       200:
 *         description: Lista de ordens de pagamento encontradas
 *       500:
 *         description: Erro ao buscar ordens de pagamento
 */
router.get('/buscar-ordem', (req, res) => orderController.searchOrders(req, res));

export default router;
