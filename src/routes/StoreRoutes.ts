import { Router } from 'express';
import { StoreController } from '../controller/StoreController';

const router = Router();

/**
 * @swagger
 * /api/dadoslojas:
 *   get:
 *     summary: Retorna uma lista de todas as lojas
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   loja:string
 */
router.get('/dadoslojas', StoreController.getAllStores);

/**
 * @swagger
 * /api/lojasgrupo:
 *   get:
 *     summary: Retorna uma lista de lojas filtradas por nome
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para lojas
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   loja:
 *                     type: string
 */
router.get('/lojasgrupo', StoreController.searchStores);

export default router; 