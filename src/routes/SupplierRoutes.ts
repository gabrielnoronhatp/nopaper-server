import { Router } from 'express';
import { SupplierController } from '../controller/SupplierController';

const router = Router();

/**
 * @swagger
 * /api/fornec_dist:
 *   get:
 *     tags:
 *       - Suppliers
 *     summary: Retorna uma lista de fornecedores
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para fornecedores
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fornecedor:
 *                     type: string
 */
router.get('/fornec_dist', SupplierController.getSuppliers);




export default router; 